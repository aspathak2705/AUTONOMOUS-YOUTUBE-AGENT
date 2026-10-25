# Autonomous YouTube Agent — Local Development Guide

## 1. Prerequisites

Verify installed tools on your local system:
- **Python**: 3.10, 3.11, or 3.12 (Detected: Python 3.10.11)
- **Git**: 2.x+ (Detected: 2.54.0.windows.1)
- **Node.js & npm**: Node 18+ and npm 9+ (Required for frontend development)
- **Docker**: Optional for containerized backend execution

---

## 2. Environment Audit

Run the built-in diagnostic script from project root:
```powershell
python scripts/check_environment.py
```
This script audits:
- Installed toolchain versions
- Configuration file availability
- Missing environment variables
- Local media storage write access

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

### 3.2 Configure Backend Environment
Copy the example configuration to `.env` in the repository root:
```powershell
cp .env.example .env
```
Key configuration items:
- `DATABASE_URL`: Your Supabase connection string.
- `OPENROUTER_API_KEY`: Free key from [OpenRouter](https://openrouter.ai).
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth credentials from Google Cloud Console.

### 3.3 Starting the Backend
```powershell
# In backend directory (with virtual environment active):
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Verify endpoints in browser or curl:
- Root: `http://127.0.0.1:8000/`
- Process Liveness: `http://127.0.0.1:8000/api/v1/health/live`
- Readiness & DB Status: `http://127.0.0.1:8000/api/v1/health/ready`
- Dependencies Report: `http://127.0.0.1:8000/api/v1/health/dependencies`

---

## 4. Supabase Database Configuration & Migrations

### 4.1 Connection Settings
Supabase offers two connection methods:
1. **Direct Connection (Port 5432)**:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?sslmode=require
   ```
   *Note: Direct connection requires IPv6 support.*
2. **Session Pooler (Port 6543)**:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?sslmode=require
   ```
   *Recommended for IPv4-only networks and local development.*

### 4.2 Test Database Connection
```powershell
python scripts/check_supabase_connection.py
```

### 4.3 Database Migrations (Alembic)
Run migrations to update database schema:
```powershell
cd backend
alembic upgrade head
```
Create a new migration after model changes:
```powershell
alembic revision --autogenerate -m "describe_changes"
```

---

## 5. Frontend Setup

### 5.1 Installation & Startup
```powershell
cd frontend
cp .env.example .env
npm install
npm run dev
```
The dashboard starts at `http://localhost:5173`. It connects to backend health endpoints at `http://localhost:8000`.

---

## 6. Running Tests & Quality Checks

### 6.1 Backend Tests
```powershell
# From project root:
$env:PYTHONPATH = "backend"
python -m pytest backend/tests -v
```

### 6.2 Syntax Verification
```powershell
python -m py_compile backend/app/main.py backend/app/core/config.py backend/app/db/session.py
```

### 6.3 Frontend Tests (Once Node.js is installed)
```powershell
cd frontend
npm test
npm run lint
```

---

## 7. Troubleshooting Common Issues

1. **`OperationalError` on Database Check**:
   - Check if you are on an IPv4 network. Use port `6543` (Supabase Session Pooler) instead of `5432`.
   - Verify `sslmode=require` is present in query parameters.
2. **CORS Error in Browser**:
   - Verify `FRONTEND_ORIGIN` in `.env` matches your browser URL (default: `http://localhost:5173`).
3. **ModuleNotFoundError: No module named 'app'**:
   - Set `PYTHONPATH=backend` or install backend in editable mode via `pip install -e .`.
