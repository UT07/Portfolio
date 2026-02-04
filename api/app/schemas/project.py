from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ProjectBase(BaseModel):
    slug: str = Field(..., min_length=1, max_length=100)
    title: str = Field(..., min_length=1, max_length=200)
    subtitle: Optional[str] = Field(None, max_length=300)
    description: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    thumbnail_url: Optional[str] = Field(None, max_length=500)
    display_order: int = 0
    is_published: bool = False
    is_featured: bool = False
    tags: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None


class ProjectCreate(ProjectBase):
    section_id: UUID


class ProjectUpdate(BaseModel):
    slug: Optional[str] = Field(None, min_length=1, max_length=100)
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    subtitle: Optional[str] = Field(None, max_length=300)
    description: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    thumbnail_url: Optional[str] = Field(None, max_length=500)
    display_order: Optional[int] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None
    tags: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None
    section_id: Optional[UUID] = None


class ProjectResponse(ProjectBase):
    id: UUID
    section_id: UUID
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    items: List[ProjectResponse]
    total: int


class ProjectReorderRequest(BaseModel):
    project_ids: List[UUID] = Field(..., description="Ordered list of project IDs")
