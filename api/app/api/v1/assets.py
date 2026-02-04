from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy import func, select

from app.api.deps import AdminUser, DBSession
from app.models.asset import Asset
from app.models.project import Project
from app.schemas.asset import AssetListResponse, AssetResponse, AssetUpdate
from app.services.s3_service import s3_service

router = APIRouter(prefix="/assets", tags=["Assets"])

ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "video/mp4",
    "video/quicktime",
    "video/webm",
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "application/pdf",
}

MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB


@router.get("", response_model=AssetListResponse)
async def list_assets(
    db: DBSession,
    admin: AdminUser,
    project_id: Optional[UUID] = None,
    file_type: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    query = select(Asset)

    if project_id:
        query = query.where(Asset.project_id == project_id)
    if file_type:
        query = query.where(Asset.file_type == file_type)

    query = query.order_by(Asset.created_at.desc()).offset(skip).limit(limit)

    result = await db.execute(query)
    assets = result.scalars().all()

    count_query = select(func.count(Asset.id))
    if project_id:
        count_query = count_query.where(Asset.project_id == project_id)
    if file_type:
        count_query = count_query.where(Asset.file_type == file_type)

    count_result = await db.execute(count_query)
    total = count_result.scalar() or 0

    return AssetListResponse(items=assets, total=total)


@router.get("/{asset_id}", response_model=AssetResponse)
async def get_asset(db: DBSession, admin: AdminUser, asset_id: UUID):
    result = await db.execute(select(Asset).where(Asset.id == asset_id))
    asset = result.scalar_one_or_none()

    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found",
        )

    return asset


@router.post("/upload", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
async def upload_asset(
    db: DBSession,
    admin: AdminUser,
    file: UploadFile = File(...),
    project_id: Optional[UUID] = Form(None),
    alt_text: Optional[str] = Form(None),
    caption: Optional[str] = Form(None),
):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_MIME_TYPES)}",
        )

    if project_id:
        project_result = await db.execute(
            select(Project).where(Project.id == project_id)
        )
        if not project_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )

    try:
        upload_result = await s3_service.upload_file(file, folder="assets")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}",
        )

    asset = Asset(
        project_id=project_id,
        filename=upload_result["filename"],
        original_filename=upload_result["original_filename"],
        file_type=upload_result["file_type"],
        mime_type=upload_result["mime_type"],
        file_size=upload_result["file_size"],
        s3_key=upload_result["s3_key"],
        s3_bucket=upload_result["s3_bucket"],
        cloudfront_url=upload_result["cloudfront_url"],
        thumbnail_url=upload_result.get("thumbnail_url"),
        width=upload_result.get("width"),
        height=upload_result.get("height"),
        alt_text=alt_text,
        caption=caption,
    )

    db.add(asset)
    await db.flush()
    await db.refresh(asset)

    return asset


@router.post("/upload-multiple", response_model=List[AssetResponse], status_code=status.HTTP_201_CREATED)
async def upload_multiple_assets(
    db: DBSession,
    admin: AdminUser,
    files: List[UploadFile] = File(...),
    project_id: Optional[UUID] = Form(None),
):
    if len(files) > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 10 files allowed per request",
        )

    for file in files:
        if file.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type not allowed for {file.filename}",
            )

    if project_id:
        project_result = await db.execute(
            select(Project).where(Project.id == project_id)
        )
        if not project_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )

    assets = []
    for file in files:
        try:
            upload_result = await s3_service.upload_file(file, folder="assets")

            asset = Asset(
                project_id=project_id,
                filename=upload_result["filename"],
                original_filename=upload_result["original_filename"],
                file_type=upload_result["file_type"],
                mime_type=upload_result["mime_type"],
                file_size=upload_result["file_size"],
                s3_key=upload_result["s3_key"],
                s3_bucket=upload_result["s3_bucket"],
                cloudfront_url=upload_result["cloudfront_url"],
                thumbnail_url=upload_result.get("thumbnail_url"),
                width=upload_result.get("width"),
                height=upload_result.get("height"),
            )

            db.add(asset)
            assets.append(asset)
        except Exception as e:
            continue

    await db.flush()
    for asset in assets:
        await db.refresh(asset)

    return assets


@router.put("/{asset_id}", response_model=AssetResponse)
async def update_asset(
    db: DBSession,
    admin: AdminUser,
    asset_id: UUID,
    asset_data: AssetUpdate,
):
    result = await db.execute(select(Asset).where(Asset.id == asset_id))
    asset = result.scalar_one_or_none()

    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found",
        )

    if asset_data.project_id:
        project_result = await db.execute(
            select(Project).where(Project.id == asset_data.project_id)
        )
        if not project_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )

    update_data = asset_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(asset, field, value)

    await db.flush()
    await db.refresh(asset)

    return asset


@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_asset(db: DBSession, admin: AdminUser, asset_id: UUID):
    result = await db.execute(select(Asset).where(Asset.id == asset_id))
    asset = result.scalar_one_or_none()

    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found",
        )

    keys_to_delete = [asset.s3_key]
    if asset.thumbnail_url:
        thumb_key = asset.thumbnail_url.split(f"/{s3_service.cloudfront_domain}/")[-1]
        if thumb_key != asset.s3_key:
            keys_to_delete.append(thumb_key)

    await s3_service.delete_files(keys_to_delete)
    await db.delete(asset)
