# Autonomous YouTube Agent

An AI-assisted YouTube content production and publishing system designed for solo creators.

---

## Overview

The Autonomous YouTube Agent automates niche topic research, structured video & Shorts packaging, publishing asset validation, and scheduled publication via the YouTube Data API v3, operating under a zero-cost API infrastructure budget with a retro-inspired creator workspace.

---

## Technology Stack

- **Backend**: Python 3.10+, FastAPI, SQLAlchemy 2.0, Alembic, Pydantic V2, Psycopg 3.
- **Frontend**: React 18, TypeScript (Strict Mode), Vite, Retro Studio Design System (CSS Tokens).
- **Database**: Supabase PostgreSQL (Managed, connection pooling supported).
- **LLM Gateway**: OpenRouter Free Tier (`openrouter/free`, `meta-llama/llama-3.3-70b-instruct:free`).
- **YouTube**: YouTube Data API v3, Google OAuth 2.0 (Testing Mode).
- **Execution**: Direct native execution (Docker explicitly excluded from workflow).

---

## Repository Structure

```
autonomous-youtube-agent/
├── frontend/             # React + TypeScript + Vite UI with Retro Studio theme
│   ├── src/
│   │   ├── components/   # AppShell, RetroWindow, PixelButton, StatusBadge
│   │   ├── pages/        # Dashboard
│   │   ├── services/     # Typed API clients (healthApi, profileApi)
│   │   ├── styles/       # tokens.css, global.css
│   │   └── types/        # api.ts
├── backend/              # FastAPI + SQLAlchemy + Pydantic backend
│   ├── app/
│   │   ├── api/routes/   # health, profile
│   │   ├── core/         # config, logging
│   │   ├── db/           # base, session, repositories
│   │   ├── models/       # entities (CreatorProfile, WeeklyTopicSchedule, etc.)
│   │   ├── schemas/      # health, profile
│   │   └── services/     # profile_service
│   ├── migrations/       # Alembic migrations (001_initial_phase1_schema)
│   └── tests/            # pytest suite (models, services, APIs, health)
├── docs/                 # Architecture, Feasibility, Development & Deployment guides
├── scripts/              # Environment & connectivity diagnostics
├── AGENTS.md             # Engineering conventions and rules
├── .env.example          # Backend environment template
└── README.md
```

---

## Quickstart (Local Development)

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On Unix / macOS:
source .venv/bin/activate

pip install -e ".[dev]"
```

Configure your environment:
```bash
cp ../.env.example .env
```

Start the FastAPI backend:
```bash
uvicorn app.main:app --reload --port 8000
```
- API Base: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs` (when `APP_DEBUG=true`)

### 2. Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Dashboard will be available at `http://localhost:5173`.

---

## Database Migrations (Alembic)

To apply migrations against your configured Supabase PostgreSQL database:
```bash
cd backend
alembic upgrade head
```

To generate static migration SQL without an active database:
```bash
cd backend
alembic upgrade head --sql
```

---

## Running Verification & Tests

Run the safe environment audit:
```bash
python scripts/check_environment.py
```

Test your Supabase connection:
```bash
python scripts/check_supabase_connection.py
```

Run backend unit tests:
```bash
$env:PYTHONPATH = "backend"
python -m pytest backend/tests -v
```

---

## Documentation

Detailed documentation is available in [`docs/`](file:///c:/Users/athar/OneDrive/Documents/projects/Youtube-Autonomous-Agent/docs):
- [Architecture Blueprint](file:///c:/Users/athar/OneDrive/Documents/projects/Youtube-Autonomous-Agent/docs/architecture.md)
- [Feasibility Report](file:///c:/Users/athar/OneDrive/Documents/projects/Youtube-Autonomous-Agent/docs/feasibility-report.md)
- [Development Guide](file:///c:/Users/athar/OneDrive/Documents/projects/Youtube-Autonomous-Agent/docs/development.md)
- [Deployment Guide](file:///c:/Users/athar/OneDrive/Documents/projects/Youtube-Autonomous-Agent/docs/deployment.md)
