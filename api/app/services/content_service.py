from typing import Any, Dict, List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.asset import Asset
from app.models.project import Project
from app.models.section import Section


class ContentService:
    @staticmethod
    async def get_all_content(db: AsyncSession) -> Dict[str, Any]:
        result = await db.execute(
            select(Section)
            .where(Section.is_active == True)
            .options(selectinload(Section.projects).selectinload(Project.assets))
            .order_by(Section.display_order)
        )
        sections = result.scalars().all()

        content = {}
        for section in sections:
            published_projects = [
                p for p in section.projects
                if p.is_published
            ]
            published_projects.sort(key=lambda x: x.display_order)

            content[section.slug] = {
                "id": str(section.id),
                "title": section.title,
                "description": section.description,
                "projects": [
                    ContentService._project_to_dict(p)
                    for p in published_projects
                ],
            }

        return content

    @staticmethod
    async def get_section_content(
        db: AsyncSession,
        section_slug: str,
    ) -> Optional[Dict[str, Any]]:
        result = await db.execute(
            select(Section)
            .where(Section.slug == section_slug, Section.is_active == True)
            .options(selectinload(Section.projects).selectinload(Project.assets))
        )
        section = result.scalar_one_or_none()

        if not section:
            return None

        published_projects = [
            p for p in section.projects
            if p.is_published
        ]
        published_projects.sort(key=lambda x: x.display_order)

        return {
            "id": str(section.id),
            "slug": section.slug,
            "title": section.title,
            "description": section.description,
            "projects": [
                ContentService._project_to_dict(p)
                for p in published_projects
            ],
        }

    @staticmethod
    def _project_to_dict(project: Project) -> Dict[str, Any]:
        return {
            "id": str(project.id),
            "slug": project.slug,
            "title": project.title,
            "subtitle": project.subtitle,
            "description": project.description,
            "content": project.content,
            "thumbnail_url": project.thumbnail_url,
            "is_featured": project.is_featured,
            "tags": project.tags or [],
            "extra_data": project.extra_data,
            "published_at": project.published_at.isoformat() if project.published_at else None,
            "assets": [
                ContentService._asset_to_dict(a)
                for a in project.assets
            ],
        }

    @staticmethod
    def _asset_to_dict(asset: Asset) -> Dict[str, Any]:
        return {
            "id": str(asset.id),
            "filename": asset.filename,
            "file_type": asset.file_type,
            "cloudfront_url": asset.cloudfront_url,
            "thumbnail_url": asset.thumbnail_url,
            "width": asset.width,
            "height": asset.height,
            "duration": asset.duration,
            "alt_text": asset.alt_text,
            "caption": asset.caption,
        }


content_service = ContentService()
