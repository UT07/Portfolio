from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import selectinload

from app.api.deps import AdminUser, DBSession
from app.models.project import Project
from app.models.section import Section
from app.schemas.project import (
    ProjectCreate,
    ProjectListResponse,
    ProjectReorderRequest,
    ProjectResponse,
    ProjectUpdate,
)

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=ProjectListResponse)
async def list_projects(
    db: DBSession,
    section_id: Optional[UUID] = None,
    published_only: bool = True,
    featured_only: bool = False,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    query = select(Project).options(selectinload(Project.assets))

    if section_id:
        query = query.where(Project.section_id == section_id)
    if published_only:
        query = query.where(Project.is_published == True)
    if featured_only:
        query = query.where(Project.is_featured == True)

    query = query.order_by(Project.display_order).offset(skip).limit(limit)

    result = await db.execute(query)
    projects = result.scalars().all()

    count_query = select(func.count(Project.id))
    if section_id:
        count_query = count_query.where(Project.section_id == section_id)
    if published_only:
        count_query = count_query.where(Project.is_published == True)
    if featured_only:
        count_query = count_query.where(Project.is_featured == True)

    count_result = await db.execute(count_query)
    total = count_result.scalar() or 0

    return ProjectListResponse(items=projects, total=total)


@router.get("/by-section/{section_slug}", response_model=ProjectListResponse)
async def list_projects_by_section_slug(
    db: DBSession,
    section_slug: str,
    published_only: bool = True,
):
    section_result = await db.execute(
        select(Section).where(Section.slug == section_slug)
    )
    section = section_result.scalar_one_or_none()

    if not section:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found",
        )

    query = (
        select(Project)
        .options(selectinload(Project.assets))
        .where(Project.section_id == section.id)
    )

    if published_only:
        query = query.where(Project.is_published == True)

    query = query.order_by(Project.display_order)

    result = await db.execute(query)
    projects = result.scalars().all()

    return ProjectListResponse(items=projects, total=len(projects))


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(db: DBSession, project_id: UUID):
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.assets))
        .where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    return project


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(db: DBSession, admin: AdminUser, project_data: ProjectCreate):
    section_result = await db.execute(
        select(Section).where(Section.id == project_data.section_id)
    )
    if not section_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found",
        )

    existing = await db.execute(
        select(Project).where(
            Project.section_id == project_data.section_id,
            Project.slug == project_data.slug,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Project with this slug already exists in this section",
        )

    project = Project(**project_data.model_dump())
    db.add(project)
    await db.flush()
    await db.refresh(project)

    return project


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    db: DBSession,
    admin: AdminUser,
    project_id: UUID,
    project_data: ProjectUpdate,
):
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.assets))
        .where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    if project_data.section_id:
        section_result = await db.execute(
            select(Section).where(Section.id == project_data.section_id)
        )
        if not section_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Section not found",
            )

    if project_data.slug:
        section_id = project_data.section_id or project.section_id
        existing = await db.execute(
            select(Project).where(
                Project.section_id == section_id,
                Project.slug == project_data.slug,
                Project.id != project_id,
            )
        )
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Project with this slug already exists in this section",
            )

    update_data = project_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    await db.flush()
    await db.refresh(project)

    return project


@router.post("/{project_id}/publish", response_model=ProjectResponse)
async def publish_project(db: DBSession, admin: AdminUser, project_id: UUID):
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.assets))
        .where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    project.is_published = True
    if not project.published_at:
        project.published_at = datetime.now(timezone.utc)

    await db.flush()
    await db.refresh(project)

    return project


@router.post("/{project_id}/unpublish", response_model=ProjectResponse)
async def unpublish_project(db: DBSession, admin: AdminUser, project_id: UUID):
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.assets))
        .where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    project.is_published = False

    await db.flush()
    await db.refresh(project)

    return project


@router.post("/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_projects(
    db: DBSession,
    admin: AdminUser,
    reorder_data: ProjectReorderRequest,
):
    for index, project_id in enumerate(reorder_data.project_ids):
        result = await db.execute(select(Project).where(Project.id == project_id))
        project = result.scalar_one_or_none()
        if project:
            project.display_order = index


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(db: DBSession, admin: AdminUser, project_id: UUID):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    await db.delete(project)
