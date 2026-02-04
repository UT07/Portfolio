from typing import Any, Dict

from fastapi import APIRouter, HTTPException, status

from app.api.deps import DBSession
from app.services.content_service import ContentService

router = APIRouter(prefix="/content", tags=["Public Content"])


@router.get("", response_model=Dict[str, Any])
async def get_all_content(db: DBSession):
    content = await ContentService.get_all_content(db)
    return content


@router.get("/tech", response_model=Dict[str, Any])
async def get_tech_content(db: DBSession):
    content = await ContentService.get_section_content(db, "tech")
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tech section not found",
        )
    return content


@router.get("/dj", response_model=Dict[str, Any])
async def get_dj_content(db: DBSession):
    content = await ContentService.get_section_content(db, "dj")
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DJ section not found",
        )
    return content


@router.get("/{section_slug}", response_model=Dict[str, Any])
async def get_section_content(db: DBSession, section_slug: str):
    content = await ContentService.get_section_content(db, section_slug)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found",
        )
    return content
