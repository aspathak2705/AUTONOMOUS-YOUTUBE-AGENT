# Autonomous YouTube Agent

An AI-assisted YouTube content production and publishing system designed for solo creators.

---

## Overview

The Autonomous YouTube Agent automates niche topic research, structured video & Shorts packaging, publishing asset validation, and scheduled publication via the YouTube Data API v3, operating under a zero-cost API infrastructure budget.

---

## Repository Structure

```
autonomous-youtube-agent/
├── frontend/             # React + TypeScript + Vite UI
├── backend/              # FastAPI + SQLAlchemy + Pydantic backend
│   ├── app/              # Application source (core, db, schemas, api, services)
│   ├── migrations/       # Alembic database migrations
│   └── tests/            # Automated test suite
├── deployment/           # Dockerfile & compose definitions
├── docs/                 # Architecture, Feasibility, Development & Deployment guides
├── scripts/              # Environment & connectivity diagnostics
├── AGENTS.md             # Engineering conventions and rules
├── .env.example          # Backend environment template
└── README.md
```

---

## Quickstart (Local Development)

### 1. Prerequisites
- Python 3.10+ (Python 3.12 recommended)
- Node.js 18+ and npm (for frontend)
- Git

### 2. Backend Setup
```bash
# In project root:
cd backend
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On Unix:
source .venv/bin/activate

pip install -e ".[dev]"
```

Configure your environment:
```bash
# In project root
cp .env.example .env
```

Start the backend:
```bash
# From backend directory
uvicorn app.main:app --reload --port 8000
```
API will be live at `http://localhost:8000`. Liveness endpoint: `http://localhost:8000/api/v1/health/live`.

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Dashboard will be live at `http://localhost:5173`.

---

## Running Verification Scripts

Run the safe environment audit:
```bash
python scripts/check_environment.py
```

Test your Supabase PostgreSQL connection:
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

Detailed documentation is available in the [`docs/`](file:///c:/Users/athar/OneDrive/Documents/projects/Youtube-Autonomous-Agent/docs) directory:
- [Architecture Blueprint](file:///c:/Users/athar/OneDrive/Documents/projects/Youtube-Autonomous-Agent/docs/architecture.md)
- [Feasibility Audit & Findings](file:///c:/Users/athar/OneDrive/Documents/projects/Youtube-Autonomous-Agent/docs/feasibility-report.md)
- [Development Guide](file:///c:/Users/athar/OneDrive/Documents/projects/Youtube-Autonomous-Agent/docs/development.md)
- [Deployment Guide](file:///c:/Users/athar/OneDrive/Documents/projects/Youtube-Autonomous-Agent/docs/deployment.md)
