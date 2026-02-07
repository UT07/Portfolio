# UTWorld — Dual-Mode Portfolio

A full-stack portfolio website with two distinct modes: **Professional/Tech** and **DJ**, each with its own visual identity, content, and navigation. Built with React, FastAPI, and deployed across AWS Lambda + Netlify.

**Live:** [utworld.netlify.app](https://utworld.netlify.app)
**Admin:** [admin-utworld.netlify.app](https://admin-utworld.netlify.app)
**API:** Hosted on AWS Lambda (eu-west-1)

---

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────────┐
│   Frontend   │────▸│   FastAPI    │────▸│   Neon PostgreSQL    │
│  React 19    │     │  on Lambda   │     │   (Serverless)       │
│  Port 3000   │     │  eu-west-1   │     │   eu-west-2          │
└──────────────┘     └──────┬───────┘     └──────────────────────┘
                            │
┌──────────────┐     ┌──────┴───────┐
│ Admin Panel  │────▸│  S3 Assets   │──▸ CloudFront CDN
│  React 18    │     │  + Uploads   │
│  Port 3001   │     └──────────────┘
└──────────────┘
```

The frontend fetches content from the API at load time and falls back to bundled static JSON if the API is unavailable. Assets (images, videos) are served from S3 via CloudFront. The admin panel provides a CMS for managing all content, gigs, projects, and media.

---

## Project Structure

```
Portfolio-main/
├── frontend/          React 19 + Tailwind — public-facing site
│   ├── src/
│   │   ├── components/    UI components (Hero, GigCarousel, Sets, PressKit, etc.)
│   │   ├── contexts/      ContentContext — API fetching + static fallback
│   │   ├── services/      api.js — content transforms + clip merging
│   │   ├── data/          Static JSON fallback (djData.json, professionalData.json)
│   │   └── utils/         Asset URL resolution (assetUrl helper)
│   ├── netlify/functions/ Serverless functions (SoundCloud, YouTube proxies)
│   └── craco.config.js   Path alias (@/) and Tailwind config
│
├── admin/             React 18 — content management panel
│   ├── src/
│   │   ├── pages/
│   │   │   ├── dj/        Gigs, Sets, PressKit, Artist management
│   │   │   └── tech/      FeaturedProjects, GithubProjects, Skills, Certifications
│   │   ├── components/    ImagePicker (S3 upload), DynamicList
│   │   └── services/      API client (CRUD, asset uploads)
│   └── netlify.toml       SPA routing config
│
├── api/               FastAPI — REST API + asset management
│   ├── app/
│   │   ├── models/        SQLAlchemy models (Project, Section, Asset, User)
│   │   ├── routers/       API routes (content, projects, assets, auth)
│   │   ├── services/      Business logic (content aggregation, S3 uploads)
│   │   └── config.py      Environment-driven configuration
│   ├── scripts/           Database seeding + migration utilities
│   ├── template.yaml      AWS SAM template (Lambda + API Gateway)
│   ├── Dockerfile.lambda  Container image for Lambda deployment
│   └── deploy.sh          One-command deployment script
│
└── netlify.toml       Root build config for frontend (Netlify)
```

---

## Tech Stack

**Frontend:** React 19, Tailwind CSS, Framer Motion, Lucide icons, craco (CRA override)
**Admin Panel:** React 18, React Router v6, Tailwind CSS, Lucide icons
**API:** FastAPI, SQLAlchemy (async), Pydantic v2, Mangum (Lambda adapter)
**Database:** Neon PostgreSQL (serverless, eu-west-2)
**Storage:** AWS S3 + CloudFront CDN
**Hosting:** Netlify (frontend + admin), AWS Lambda via SAM (API)
**Auth:** JWT (HS256) with bcrypt password hashing

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.10+
- AWS CLI configured (for API deployment)
- Docker (for Lambda container builds)

### 1. Clone and install

```bash
git clone <repo-url> && cd Portfolio-main

# Frontend
cd frontend && npm install && cd ..

# Admin
cd admin && npm install && cd ..

# API
cd api && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure environment

Copy the example files and fill in your values:

```bash
cp api/.env.example api/.env
cp frontend/.env.example frontend/.env
cp admin/.env.example admin/.env
```

### 3. Seed the admin user

```bash
cd api
python -m scripts.seed_admin --email you@example.com --password YourSecurePass
```

### 4. Run locally

```bash
# Terminal 1 — API
cd api && uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend && npm start    # http://localhost:3000

# Terminal 3 — Admin
cd admin && npm start       # http://localhost:3001
```

---

## Deployment

### API (AWS Lambda)

The API runs as a Docker container on Lambda behind API Gateway:

```bash
cd api
chmod +x deploy.sh
./deploy.sh
```

The script builds the Docker image, pushes to ECR, and deploys via SAM. It reads `DATABASE_URL` and `SECRET_KEY` from `api/.env` at deploy time — these are never stored in config files.

### Frontend (Netlify)

Connected to the GitHub repo with these settings:

| Setting | Value |
|---------|-------|
| Base directory | `frontend` |
| Build command | `yarn build` |
| Publish directory | `frontend/build` |
| Env variable | `REACT_APP_API_URL` = your API Gateway URL + `/api/v1` |

### Admin Panel (Netlify)

A separate Netlify site from the same repo:

| Setting | Value |
|---------|-------|
| Base directory | `admin` |
| Build command | `npm run build` |
| Publish directory | `admin/build` |
| Env variable | `REACT_APP_API_URL` = your API Gateway URL + `/api/v1` |

---

## Key Features

### Dual-Mode Portfolio
Toggle between Professional and DJ personas. Each mode has its own hero, navigation, color scheme, and content sections. The DJ side features a dark, neon-red aesthetic with animated backgrounds; the professional side is clean and minimal.

### Live Music Integration
The Sets section fetches live data from SoundCloud and YouTube APIs (via Netlify Functions for server-side key protection), with RSS feed fallback. Displays tracks, play counts, and thumbnails in real-time.

### Gig Clips Carousel
Video clips from DJ gigs are stored in S3 and served via CloudFront. The carousel supports any number of clips per gig with adaptive grid layout and inline playback.

### Press Kit
Professional assets page with artist bio, technical rider (equipment requirements), and photo gallery. Gallery images support both file upload (to S3) and manual URL entry.

### Admin CMS
Full content management for both portfolio modes — edit projects, manage gig clips, update certifications, upload assets to S3. JWT-authenticated with role-based access.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/v1/content` | All published content (sections + projects) |
| `GET` | `/api/v1/content/{slug}` | Single section content |
| `GET` | `/api/v1/projects` | List projects (with filters) |
| `POST` | `/api/v1/auth/login` | JWT authentication |
| `POST` | `/api/v1/assets/upload` | Upload file to S3 |
| `PUT` | `/api/v1/projects/{id}` | Update project (authenticated) |

---

## Environment Variables

### API (`api/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL async connection string |
| `SECRET_KEY` | JWT signing key — generate with `python -c "import secrets; print(secrets.token_hex(32))"` |
| `S3_BUCKET` | AWS S3 bucket for assets |
| `CLOUDFRONT_DOMAIN` | CloudFront distribution domain |
| `CORS_ORIGINS` | JSON array of allowed origins |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Full API base URL including `/api/v1` |
| `REACT_APP_USE_API` | Enable API fetching (`true`/`false`) |
| `REACT_APP_ASSET_BASE_URL` | CloudFront base URL for assets |

---

## Security

- **Never commit `.env` files** — gitignored via `**/.env`. Use `.env.example` as reference.
- **`samconfig.toml`** uses placeholder values only. Real secrets are injected at deploy time via `deploy.sh`.
- **Admin scripts** read credentials from environment variables or CLI arguments, never from hardcoded defaults.
- **API keys** for SoundCloud/YouTube are stored as Netlify environment variables (server-side only), never in frontend code.

---

## License

Private project. All rights reserved.
