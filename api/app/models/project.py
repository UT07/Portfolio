import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any, Dict, List, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.asset import Asset
    from app.models.section import Section


class Project(Base):
    __tablename__ = "projects"
    __table_args__ = (
        UniqueConstraint("section_id", "slug", name="uq_project_section_slug"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    section_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("sections.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    slug: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    subtitle: Mapped[Optional[str]] = mapped_column(String(300))
    description: Mapped[Optional[str]] = mapped_column(Text)
    content: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500))
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    tags: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String(50)))
    metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    # Relationships
    section: Mapped["Section"] = relationship("Section", back_populates="projects")
    assets: Mapped[List["Asset"]] = relationship(
        "Asset",
        back_populates="project",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Project {self.title}>"
