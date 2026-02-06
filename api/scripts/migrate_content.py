#!/usr/bin/env python3
"""
Migrate existing JSON content to the API database.

Defaults are safe: it will create missing items and skip existing ones unless
--overwrite is passed.
"""
import json
import os
import sys
from pathlib import Path

import requests

API_BASE = os.getenv("API_BASE", "http://localhost:8000/api/v1")
CLOUDFRONT_BASE = os.getenv(
    "CLOUDFRONT_BASE",
    "https://d1q048o59d0tgk.cloudfront.net/assets",
)
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@utworld.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "UTadmin2024!")

OVERWRITE = "--overwrite" in sys.argv

SCRIPT_DIR = Path(__file__).resolve().parent
API_DIR = SCRIPT_DIR.parent
ROOT_DIR = API_DIR.parent


# Login and get token
def get_token():
    resp = requests.post(
        f"{API_BASE}/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
    )
    resp.raise_for_status()
    return resp.json()["access_token"]

def auth_headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

def get_sections(token):
    resp = requests.get(f"{API_BASE}/sections", headers=auth_headers(token))
    resp.raise_for_status()
    data = resp.json()
    items = data.get("items", data) if isinstance(data, dict) else data
    return {s["slug"]: s["id"] for s in items}


def create_section(token, data):
    resp = requests.post(
        f"{API_BASE}/sections",
        headers=auth_headers(token),
        json=data,
    )
    if resp.status_code in (200, 201):
        return resp.json()
    print(f"Error creating section: {resp.text}")
    return None


def ensure_sections(token):
    sections = get_sections(token)
    if "dj" not in sections:
        created = create_section(
            token,
            {
                "slug": "dj",
                "title": "DJ",
                "description": "DJ content and gigs",
                "display_order": 1,
                "is_active": True,
            },
        )
        if created:
            sections["dj"] = created["id"]
    if "tech" not in sections:
        created = create_section(
            token,
            {
                "slug": "tech",
                "title": "Tech",
                "description": "Professional and technical content",
                "display_order": 0,
                "is_active": True,
            },
        )
        if created:
            sections["tech"] = created["id"]
    return sections


def get_projects_by_section(token, section_slug):
    resp = requests.get(
        f"{API_BASE}/projects/by-section/{section_slug}",
        params={"published_only": "false"},
        headers=auth_headers(token),
    )
    resp.raise_for_status()
    data = resp.json()
    items = data.get("items", data) if isinstance(data, dict) else data
    return {p["slug"]: p for p in items}


def create_project(token, section_id, data):
    resp = requests.post(
        f"{API_BASE}/projects",
        headers=auth_headers(token),
        json={**data, "section_id": section_id}
    )
    if resp.status_code == 201:
        return resp.json()
    print(f"Error creating project: {resp.text}")
    return None


def update_project(token, project_id, data):
    resp = requests.put(
        f"{API_BASE}/projects/{project_id}",
        headers=auth_headers(token),
        json=data,
    )
    if resp.status_code == 200:
        return resp.json()
    print(f"Error updating project: {resp.text}")
    return None


def upsert_project(token, section_id, existing, data):
    slug = data.get("slug")
    if existing and slug in existing:
        if OVERWRITE:
            return update_project(token, existing[slug]["id"], data)
        print(f"  ↪︎ Skipping existing {slug}")
        return existing[slug]
    return create_project(token, section_id, data)


def with_cdn(path):
    if not path:
        return None
    if path.startswith("http"):
        return path
    return f"{CLOUDFRONT_BASE}{path}"

def main():
    token = get_token()
    print("✓ Authenticated")

    sections = ensure_sections(token)
    print(f"✓ Found sections: {list(sections.keys())}")

    # Load JSON data
    with open(ROOT_DIR / "frontend" / "src" / "data" / "djData.json") as f:
        dj_data = json.load(f)
    with open(ROOT_DIR / "frontend" / "src" / "data" / "professionalData.json") as f:
        pro_data = json.load(f)
    with open(ROOT_DIR / "frontend" / "src" / "data" / "projectsData.json") as f:
        projects_data = json.load(f)

    print("✓ Loaded content files")

    # ========== DJ SECTION ==========
    dj_section_id = sections["dj"]
    existing_dj = get_projects_by_section(token, "dj")

    # DJ Hero
    upsert_project(token, dj_section_id, existing_dj, {
        "slug": "hero",
        "title": dj_data["hero"]["name"],
        "subtitle": dj_data["hero"]["badge"],
        "description": dj_data["hero"]["headline"],
        "content": {
            "subheadline": dj_data["hero"]["subheadline"],
            "genres": dj_data["hero"]["genres"],
            "ctas": dj_data["hero"]["ctas"]
        },
        "thumbnail_url": with_cdn(dj_data["hero"]["hero_image"]),
        "display_order": 1,
        "is_published": True,
        "is_featured": True,
        "tags": ["hero", "landing"]
    })
    print("  ✓ Created DJ hero")

    # DJ Artist
    upsert_project(token, dj_section_id, existing_dj, {
        "slug": "artist",
        "title": "Artist",
        "subtitle": dj_data["artist"]["title"],
        "description": dj_data["artist"]["bio"],
        "content": {
            "highlights": dj_data["artist"]["highlights"]
        },
        "thumbnail_url": with_cdn(dj_data["artist"]["artist_image"]),
        "display_order": 2,
        "is_published": True,
        "tags": ["artist", "bio"]
    })
    print("  ✓ Created DJ artist")

    # DJ Gigs - each gig as a project
    for i, gig in enumerate(dj_data["gigs"]):
        gig_slug = gig["id"] if gig["id"].startswith("gig-") else f"gig-{gig['id']}"
        upsert_project(token, dj_section_id, existing_dj, {
            "slug": gig_slug,
            "title": gig["event"],
            "subtitle": f"{gig['collective']} · {gig['location']}",
            "description": gig["description"],
            "content": {
                "date": gig["date"],
                "time": gig["time"],
                "genre": gig["genre"],
                "clips": gig.get("clips", [])
            },
            "thumbnail_url": with_cdn(gig.get("image")),
            "display_order": 10 + i,
            "is_published": True,
            "tags": gig.get("tags", []) + gig.get("genre", []),
            "extra_data": {
                "type": "gig",
                "collective": gig["collective"],
                "location": gig["location"]
            }
        })
    print(f"  ✓ Created {len(dj_data['gigs'])} gigs")

    # DJ Sets
    upsert_project(token, dj_section_id, existing_dj, {
        "slug": "sets",
        "title": dj_data["sets"]["title"],
        "description": dj_data["sets"]["description"],
        "content": {
            "platforms": dj_data["sets"]["platforms"]
        },
        "display_order": 3,
        "is_published": True,
        "tags": ["sets", "music", "soundcloud", "youtube"]
    })
    print("  ✓ Created DJ sets")

    # DJ Press Kit
    upsert_project(token, dj_section_id, existing_dj, {
        "slug": "press-kit",
        "title": dj_data["pressKit"]["title"],
        "description": dj_data["pressKit"]["description"],
        "content": {
            "bio_short": dj_data["pressKit"]["bio_short"],
            "bio_long": dj_data["pressKit"]["bio_long"],
            "technical_rider": dj_data["pressKit"]["technical_rider"],
            "downloads": dj_data["pressKit"]["downloads"],
            "gallery": dj_data["pressKit"]["gallery"]
        },
        "display_order": 4,
        "is_published": True,
        "tags": ["press", "media", "booking"]
    })
    print("  ✓ Created DJ press kit")

    # DJ Contact
    upsert_project(token, dj_section_id, existing_dj, {
        "slug": "contact",
        "title": "Contact",
        "subtitle": dj_data["contact"]["booking_title"],
        "description": dj_data["contact"]["booking_description"],
        "content": {
            "email": dj_data["contact"]["email"],
            "social": dj_data["contact"]["social"]
        },
        "display_order": 5,
        "is_published": True,
        "tags": ["contact", "booking"]
    })
    print("  ✓ Created DJ contact")

    # ========== TECH SECTION ==========
    tech_section_id = sections["tech"]
    existing_tech = get_projects_by_section(token, "tech")

    # Tech Hero
    upsert_project(token, tech_section_id, existing_tech, {
        "slug": "hero",
        "title": pro_data["hero"]["name"],
        "subtitle": pro_data["hero"]["title"],
        "description": pro_data["hero"]["headline"],
        "content": {
            "subtext": pro_data["hero"]["subtext"],
            "ctas": pro_data["hero"]["ctas"]
        },
        "thumbnail_url": with_cdn(pro_data["hero"]["headshot"]),
        "display_order": 1,
        "is_published": True,
        "is_featured": True,
        "tags": ["hero", "landing"]
    })
    print("  ✓ Created Tech hero")

    # Tech Highlights
    upsert_project(token, tech_section_id, existing_tech, {
        "slug": "highlights",
        "title": "Highlights",
        "description": "Key achievements and metrics",
        "content": {
            "items": pro_data["highlights"]
        },
        "display_order": 2,
        "is_published": True,
        "tags": ["highlights", "achievements"]
    })
    print("  ✓ Created Tech highlights")

    # Tech About
    upsert_project(token, tech_section_id, existing_tech, {
        "slug": "about",
        "title": pro_data["about"]["title"],
        "description": pro_data["about"]["paragraphs"][0],
        "content": {
            "paragraphs": pro_data["about"]["paragraphs"]
        },
        "display_order": 3,
        "is_published": True,
        "tags": ["about", "bio"]
    })
    print("  ✓ Created Tech about")

    # Tech Education
    for i, edu in enumerate(pro_data["education"]):
        upsert_project(token, tech_section_id, existing_tech, {
            "slug": f"education-{i+1}",
            "title": edu["institution"],
            "subtitle": edu["degree"],
            "description": edu["description"],
            "content": {
                "location": edu["location"],
                "dates": edu["dates"],
                "status": edu["status"],
                "modules": edu.get("modules", []),
                "projects": edu.get("projects", []),
                "thesis": edu.get("thesis"),
                "leadership": edu.get("leadership", [])
            },
            "display_order": 20 + i,
            "is_published": True,
            "tags": ["education", edu["status"].lower()],
            "extra_data": {"type": "education"}
        })
    print(f"  ✓ Created {len(pro_data['education'])} education entries")

    # Tech Experience
    for i, exp in enumerate(pro_data["experience"]):
        upsert_project(token, tech_section_id, existing_tech, {
            "slug": f"experience-{i+1}",
            "title": exp["company"],
            "subtitle": exp["role"],
            "description": exp["responsibilities"][0] if exp["responsibilities"] else "",
            "content": {
                "location": exp["location"],
                "dates": exp["dates"],
                "duration": exp["duration"],
                "responsibilities": exp["responsibilities"],
                "achievements": exp["achievements"]
            },
            "display_order": 30 + i,
            "is_published": True,
            "tags": ["experience", "work"],
            "extra_data": {"type": "experience"}
        })
    print(f"  ✓ Created {len(pro_data['experience'])} experience entries")

    # Tech Skills
    upsert_project(token, tech_section_id, existing_tech, {
        "slug": "skills",
        "title": "Skills",
        "description": "Technical skills and expertise",
        "content": {
            "categories": pro_data["skills"]["categories"]
        },
        "display_order": 4,
        "is_published": True,
        "tags": ["skills", "technical"]
    })
    print("  ✓ Created Tech skills")

    # Tech Certifications
    upsert_project(token, tech_section_id, existing_tech, {
        "slug": "certifications",
        "title": "Certifications",
        "description": "Professional certifications and credentials",
        "content": {
            "items": pro_data["certifications"]
        },
        "display_order": 5,
        "is_published": True,
        "tags": ["certifications", "aws"]
    })
    print("  ✓ Created Tech certifications")

    # Tech Contact
    upsert_project(token, tech_section_id, existing_tech, {
        "slug": "contact",
        "title": "Contact",
        "description": "Get in touch",
        "content": pro_data["contact"],
        "display_order": 6,
        "is_published": True,
        "tags": ["contact"]
    })
    print("  ✓ Created Tech contact")

    # Featured Projects
    for i, proj in enumerate(projects_data["featured"]):
        upsert_project(token, tech_section_id, existing_tech, {
            "slug": f"project-{proj['title'].lower().replace(' ', '-').replace(':', '')[:50]}",
            "title": proj["title"],
            "subtitle": proj["category"],
            "description": proj["description"],
            "content": {
                "timeline": proj["timeline"],
                "problem": proj["problem"],
                "approach": proj["approach"],
                "stack": proj["stack"],
                "outcomes": proj["outcomes"],
                "links": proj["links"]
            },
            "thumbnail_url": proj.get("demo_image"),
            "display_order": 40 + i,
            "is_published": True,
            "is_featured": True,
            "tags": proj["stack"][:5] + ["featured"],
            "extra_data": {"type": "featured_project", "category": proj["category"]}
        })
    print(f"  ✓ Created {len(projects_data['featured'])} featured projects")

    # GitHub Projects
    order = 50
    for category, projs in projects_data["github_projects"].items():
        for proj in projs:
            upsert_project(token, tech_section_id, existing_tech, {
                "slug": f"github-{proj['name'].lower().replace(' ', '-')[:40]}",
                "title": proj["name"],
                "subtitle": category.replace("_", " ").title(),
                "description": proj["description"],
                "content": {
                    "stack": proj["stack"],
                    "repo": proj["repo"],
                    "demo": proj.get("demo")
                },
                "display_order": order,
                "is_published": True,
                "tags": proj["stack"] + [category],
                "extra_data": {"type": "github_project", "category": category}
            })
            order += 1
    print(f"  ✓ Created {order - 50} GitHub projects")

    print("\n✅ Migration complete!")

    # Verify
    resp = requests.get(f"{API_BASE}/content")
    content = resp.json()
    print(f"\nVerification:")
    print(f"  DJ section: {len(content.get('dj', {}).get('projects', []))} projects")
    print(f"  Tech section: {len(content.get('tech', {}).get('projects', []))} projects")

if __name__ == "__main__":
    main()
