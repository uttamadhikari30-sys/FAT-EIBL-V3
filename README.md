# FAT-EIBL – Full (Edme Insurance Brokers Limited)

Complete ready-to-deploy stack:
- Frontend: React + Vite (theme color auto-extracted from logo)
- Backend: FastAPI (Tasks, Uploads, AI chat), SQLAlchemy
- Database: PostgreSQL (Docker)
- AI: OpenAI GPT (set OPENAI_API_KEY in backend/.env)
- Voice: Web Speech API (“Hey Vani”)
- Docker Compose + GitHub Actions (Pages deploy)

## Quick Start (Local, Docker)
```bash
docker compose up --build
# Seed demo data
curl http://localhost:8000/seed
# Open UI
http://localhost:3000
```
Backend docs: http://localhost:8000/docs

## Configure
- Frontend reads API at `VITE_API_URL` (set in docker-compose to http://localhost:8000)
- Backend env in `backend/.env`:
```
DATABASE_URL=postgresql+psycopg2://fatuser:fatpass@db:5432/fatdb
OPENAI_API_KEY=   # paste your key
EMAIL_FROM=Audit@edmeinsurance.com
SECRET_KEY=dev-secret
```

## Deploy Options
- **Render**: create two services -> backend (Docker, root `backend/`), frontend (Static Site, root `frontend/`)
- **Railway**: deploy repo; it will build Docker images
- **GitHub Pages**: GitHub Action in `.github/workflows/deploy.yml` will publish `frontend/dist`

## Branding
- Logo placed at `frontend/public/logo.png` and used as favicon
- Theme color extracted from logo: `rgb(175, 157, 165)`

## Modules Included
- Dashboard (KPIs)
- Work Task Listing + per-row file Uploader
- AI Chat (“Hey Vani”)
- Simple Audit Trail
