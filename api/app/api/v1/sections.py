from typing import List
from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import func, select

from app.api.deps import AdminUser, DBSession
from app.models.section import Section
from app.schemas.section import (
    SectionCreate,
    SectionListResponse,
    SectionResponse,
    SectionUpdate,
)

router = APIRouter(prefix="/sections", tags=["Sections"])


@router.get("", response_model=SectionListResponse)
async def list_sections(db: DBSession, include_inactive: bool = False):
    query = select(Section)
    if not include_inactive:
        query = query.where(Section.is_active == True)
    query = query.order_by(Section.display_order)

    result = await db.execute(query)
    sections = result.scalars().all()

    count_result = await db.execute(select(func.count(Section.id)))
    total = count_result.scalar() or 0

    return SectionListResponse(items=sections, total=total)


@router.get("/{section_id}", response_model=SectionResponse)
async def get_section(db: DBSession, section_id: UUID):
    result = await db.execute(select(Section).where(Section.id == section_id))
    section = result.scalar_one_or_none()

    if not section:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found",
        )

    return section


@router.post("", response_model=SectionResponse, status_code=status.HTTP_201_CREATED)
async def create_section(db: DBSession, admin: AdminUser, section_data: SectionCreate):
    existing = await db.execute(
        select(Section).where(Section.slug == section_data.slug)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Section with this slug already exists",
        )

    section = Section(**section_data.model_dump())
    db.add(section)
    await db.flush()
    await db.refresh(section)

    return section


@router.put("/{section_id}", response_model=SectionResponse)
async def update_section(
    db: DBSession,
    admin: AdminUser,
    section_id: UUID,
    section_data: SectionUpdate,
):
    result = await db.execute(select(Section).where(Section.id == section_id))
    section = result.scalar_one_or_none()

    if not section:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found",
        )

    if section_data.slug and section_data.slug != section.slug:
        existing = await db.execute(
            select(Section).where(
                Section.slug == section_data.slug,
                Section.id != section_id,
            )
        )
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Section with this slug already exists",
            )

    update_data = section_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(section, field, value)

    await db.flush()
    await db.refresh(section)

    return section


@router.delete("/{section_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_section(db: DBSession, admin: AdminUser, section_id: UUID):
    result = await db.execute(select(Section).where(Section.id == section_id))
    section = result.scalar_one_or_none()

    if not section:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found",
        )

    await db.delete(section)
