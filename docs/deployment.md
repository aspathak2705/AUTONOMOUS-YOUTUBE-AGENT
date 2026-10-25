# Autonomous YouTube Agent — Deployment Architecture

## 1. Production Architecture Overview

The application is architected for direct native cloud deployment:
1. **Frontend**: Static bundle served via CDN (Cloudflare Pages or Vercel).
2. **Backend API**: Python FastAPI application running on a container or direct cloud runtime (Render, Railway, Fly.io, or AWS App Runner).
3. **Database**: Supabase PostgreSQL managed database with pooled connections.
4. **Containerization Note**: Docker is explicitly optional/not required for local development.

---

## 2. Supabase Connection Strategy in Production Runtimes

Official Supabase documentation clarifies connection ports:
- **Direct Connection (Port 5432)**: `db.[PROJECT_REF].supabase.co:5432` — suitable if runtime supports IPv6.
- **Shared Session Pooler (Port 5432)**: `aws-0-[REGION].pooler.supabase.com:5432` — recommended for persistent backend applications with long-lived sessions on IPv4 networks.
- **Shared Transaction Pooler (Port 6543)**: `aws-0-[REGION].pooler.supabase.com:6543` — recommended for serverless or ephemeral functions.

Always enforce `sslmode=require` in remote environments.

---

## 3. Production Environment Checklist

| Variable | Description | Classification |
|---|---|---|
| `APP_ENV` | Set to `production` | Public |
| `APP_DEBUG` | Set to `false` | Public |
| `FRONTEND_ORIGIN` | Allowed web domain | Public |
| `DATABASE_URL` | Supabase Pooler URI | **CRITICAL SECRET** |
| `DATABASE_SSL_MODE` | Set to `require` | Safe |
| `OPENROUTER_API_KEY` | Bearer token for free-tier gateway | **CRITICAL SECRET** |
| `OPENROUTER_MODEL` | Explicit free model (`openrouter/free`) | Safe |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Web Application Client ID | Confidential |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret | **CRITICAL SECRET** |
| `GOOGLE_REDIRECT_URI` | HTTPS callback URL | Public |
| `GOOGLE_TOKEN_ENCRYPTION_KEY` | 32-byte Base64 key for AES-GCM token encryption | **CRITICAL SECRET** |
