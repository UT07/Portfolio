# UTWorld Admin API

FastAPI backend for the UTWorld portfolio content management system.

## Features

- JWT Authentication with access/refresh tokens
- CRUD operations for Sections, Projects, and Assets
- S3 file uploads with CloudFront CDN delivery
- Automatic image thumbnail generation
- PostgreSQL with async SQLAlchemy 2.0
- Alembic database migrations

## Quick Start

### 1. Install dependencies

```bash
cd api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Run database migrations

```bash
alembic upgrade head
```

### 4. Create admin user

```bash
python -c "
import asyncio
from app.database import async_session_maker
from app.models import User
from app.utils.security import hash_password

async def create_admin():
    async with async_session_maker() as session:
        user = User(
            email='admin@example.com',
            password_hash=hash_password('your-secure-password'),
            name='Admin',
            role='admin',
        )
        session.add(user)
        await session.commit()
        print('Admin user created!')

asyncio.run(create_admin())
"
```

### 5. Start the server

```bash
uvicorn app.main:app --reload
```

API will be available at http://localhost:8000

## API Documentation

When running in debug mode, documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login and get tokens
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user info

### Sections (Admin)
- `GET /api/v1/sections` - List all sections
- `GET /api/v1/sections/{id}` - Get section by ID
- `POST /api/v1/sections` - Create section
- `PUT /api/v1/sections/{id}` - Update section
- `DELETE /api/v1/sections/{id}` - Delete section

### Projects (Admin)
- `GET /api/v1/projects` - List projects
- `GET /api/v1/projects/{id}` - Get project by ID
- `GET /api/v1/projects/by-section/{slug}` - Get projects by section
- `POST /api/v1/projects` - Create project
- `PUT /api/v1/projects/{id}` - Update project
- `POST /api/v1/projects/{id}/publish` - Publish project
- `POST /api/v1/projects/{id}/unpublish` - Unpublish project
- `POST /api/v1/projects/reorder` - Reorder projects
- `DELETE /api/v1/projects/{id}` - Delete project

### Assets (Admin)
- `GET /api/v1/assets` - List assets
- `GET /api/v1/assets/{id}` - Get asset by ID
- `POST /api/v1/assets/upload` - Upload single file
- `POST /api/v1/assets/upload-multiple` - Upload multiple files
- `PUT /api/v1/assets/{id}` - Update asset metadata
- `DELETE /api/v1/assets/{id}` - Delete asset

### Public Content
- `GET /api/v1/content` - Get all published content
- `GET /api/v1/content/tech` - Get tech section content
- `GET /api/v1/content/dj` - Get DJ section content
- `GET /api/v1/content/{slug}` - Get section content by slug

## Project Structure

```
api/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Settings management
│   ├── database.py          # Database setup
│   ├── api/
│   │   ├── deps.py          # Dependencies (auth, db)
│   │   └── v1/
│   │       ├── router.py    # API router
│   │       ├── auth.py      # Auth endpoints
│   │       ├── sections.py  # Section endpoints
│   │       ├── projects.py  # Project endpoints
│   │       ├── assets.py    # Asset endpoints
│   │       └── content.py   # Public content endpoints
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── services/            # Business logic
│   └── utils/               # Utilities
├── alembic/                 # Database migrations
├── tests/                   # Test suite
├── .env.example
├── alembic.ini
├── requirements.txt
└── README.md
```

## Deployment

### Railway

1. Create a new project on Railway
2. Add PostgreSQL service
3. Connect your GitHub repo
4. Set environment variables
5. Deploy

### Environment Variables for Production

```
DATABASE_URL=postgresql+asyncpg://...
SECRET_KEY=<strong-secret-key>
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET=utworld-assets
CLOUDFRONT_DOMAIN=d1q048o59d0tgk.cloudfront.net
CORS_ORIGINS=["https://utworld.netlify.app","https://admin.utworld.netlify.app"]
ENVIRONMENT=production
DEBUG=false
```

## Testing

```bash
pytest tests/ -v
```

## License

Private - Utkarsh Singh
