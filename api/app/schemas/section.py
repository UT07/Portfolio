from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class SectionBase(BaseModel):
    slug: str = Field(..., min_length=1, max_length=50)
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    display_order: int = 0
    is_active: bool = True


class SectionCreate(SectionBase):
    pass


class SectionUpdate(BaseModel):
    slug: Optional[str] = Field(None, min_length=1, max_length=50)
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class SectionResponse(SectionBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SectionListResponse(BaseModel):
    items: List[SectionResponse]
    total: int
