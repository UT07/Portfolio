import pytest
from httpx import AsyncClient

from app.models import Section


@pytest.mark.asyncio
async def test_list_sections(client: AsyncClient, test_section: Section):
    response = await client.get("/api/v1/sections")

    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert len(data["items"]) >= 1


@pytest.mark.asyncio
async def test_create_section(client: AsyncClient, auth_headers: dict):
    response = await client.post(
        "/api/v1/sections",
        headers=auth_headers,
        json={
            "slug": "dj",
            "title": "DJ Section",
            "description": "DJ projects and mixes",
            "display_order": 1,
            "is_active": True,
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["slug"] == "dj"
    assert data["title"] == "DJ Section"


@pytest.mark.asyncio
async def test_create_section_duplicate_slug(
    client: AsyncClient,
    auth_headers: dict,
    test_section: Section,
):
    response = await client.post(
        "/api/v1/sections",
        headers=auth_headers,
        json={
            "slug": "tech",
            "title": "Duplicate Tech",
        },
    )

    assert response.status_code == 409


@pytest.mark.asyncio
async def test_update_section(
    client: AsyncClient,
    auth_headers: dict,
    test_section: Section,
):
    response = await client.put(
        f"/api/v1/sections/{test_section.id}",
        headers=auth_headers,
        json={"title": "Updated Tech"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Tech"


@pytest.mark.asyncio
async def test_delete_section(
    client: AsyncClient,
    auth_headers: dict,
    test_section: Section,
):
    response = await client.delete(
        f"/api/v1/sections/{test_section.id}",
        headers=auth_headers,
    )

    assert response.status_code == 204
