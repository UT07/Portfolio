from fastapi import APIRouter

from app.api.v1 import assets, auth, content, projects, sections

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(sections.router)
api_router.include_router(projects.router)
api_router.include_router(assets.router)
api_router.include_router(content.router)
