# Autonomous YouTube Agent — Local Development Guide

## 1. Prerequisites

- **Python**: 3.10+ (Verified on Python 3.10.11)
- **Node.js**: 18+ LTS and npm 9+ (Required for frontend development)
- **Git**: 2.x+
- **Docker**: *Explicitly NOT required.*

---

## 2. Environment Verification

Run the built-in diagnostic script:
```powershell
python scripts/check_environment.py
```

---

## 3. Backend Setup

### 3.1 Create Virtual Environment & Install Dependencies
Windows PowerShell:
```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
```

Unix / macOS:
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

### 3.2 Configure Environment
```powershell
# In project root
cp .env.example .env
```

### 3.3 Run Database Migrations (Alembic)
Apply migrations to configured Supabase database:
```powershell
cd backend
alembic upgrade head
```

Verify migration SQL offline:
```powershell
cd backend
alembic upgrade head --sql
```

### 3.4 Start FastAPI Server
```powershell
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Endpoints:
- Liveness: `http://127.0.0.1:8000/api/v1/health/live`
- Readiness: `http://127.0.0.1:8000/api/v1/health/ready`
- Dependencies: `http://127.0.0.1:8000/api/v1/health/dependencies`
- Creator Profile: `http://127.0.0.1:8000/api/v1/profile`
- Topic Schedules: `http://127.0.0.1:8000/api/v1/profile/schedules`

---

## 4. Supabase PostgreSQL Connection Strategy

Supabase offers two connection methods:
1. **Shared Session Pooler (Port 5432)**:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require
   ```
   *Session mode operates on port 5432.*
2. **Shared Transaction Pooler (Port 6543)**:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
   ```
   *Transaction mode operates on port 6543.*
3. **Direct Connection (Port 5432)**:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?sslmode=require
   ```
   *Requires IPv6 network support.*

Test connectivity via script:
```powershell
python scripts/check_supabase_connection.py
```

---

## 5. Frontend Setup

### 5.1 Node.js Installation
If Node.js is not installed:
- Download Node.js LTS (v20.x recommended) from [nodejs.org](https://nodejs.org).
- Verify in terminal: `node --version; npm --version`

### 5.2 Install Dependencies & Start Dev Server
```powershell
cd frontend
cp .env.example .env
npm install
npm run dev
```
Dashboard available at `http://localhost:5173`.

---

## 6. Running Tests & Code Quality

### 6.1 Backend Tests
```powershell
$env:PYTHONPATH = "backend"
python -m pytest backend/tests -v
```

### 6.2 Python Bytecode Compilation
```powershell
python -m py_compile backend/app/main.py backend/app/core/config.py backend/app/db/session.py backend/app/models/entities.py backend/app/schemas/profile.py
```

### 6.3 Frontend Checks (Once Node.js installed)
```powershell
cd frontend
npm test
npm run lint
npm run build
```
