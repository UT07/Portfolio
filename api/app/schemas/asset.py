from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class AssetBase(BaseModel):
    alt_text: Optional[str] = Field(None, max_length=255)
    caption: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class AssetCreate(AssetBase):
    project_id: Optional[UUID] = None


class AssetUpdate(BaseModel):
    project_id: Optional[UUID] = None
    alt_text: Optional[str] = Field(None, max_length=255)
    caption: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class AssetResponse(BaseModel):
    id: UUID
    project_id: Optional[UUID] = None
    filename: str
    original_filename: str
    file_type: str
    mime_type: str
    file_size: int
    s3_key: str
    s3_bucket: str
    cloudfront_url: str
    thumbnail_url: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[int] = None
    alt_text: Optional[str] = None
    caption: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AssetListResponse(BaseModel):
    items: List[AssetResponse]
    total: int
