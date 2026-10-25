# Autonomous YouTube Agent — Deployment Architecture

## 1. Production Architecture Overview

The production deployment consists of:
1. **Frontend Client**: Static bundle (HTML/JS/CSS) served via CDN (Vercel, Cloudflare Pages, or Netlify).
2. **Backend API**: Dockerized FastAPI container running on a cloud container service (e.g. Render, Railway, Fly.io, or AWS ECS/App Runner).
3. **Database**: Managed Supabase PostgreSQL with pooled connections.
4. **Scheduled Background Runner**: Continuous container or cron-triggered worker executing daily morning research, LLM orchestration, and publication workflows.

---

## 2. Infrastructure Requirements

| Component | Minimum Requirement | Recommended |
|---|---|---|
| API Memory (RAM) | 512 MB | 1 GB |
| CPU | 0.5 vCPU | 1-2 vCPU |
| Ephemeral Disk | 1 GB (for temp video processing) | 5-10 GB |
| Network | Outbound HTTPS + IPv4 egress | Static egress IP if IP-whitelisted |

---

## 3. Environment Variables (Production Checklist)

| Variable | Description | Security Requirement |
|---|---|---|
| `APP_ENV` | Must be `production` | Public |
| `APP_DEBUG` | Must be `false` (disables `/docs` and detailed stack traces) | Public |
| `FRONTEND_ORIGIN` | Exact production HTTPS URL (e.g. `https://agent.example.com`) | Safe |
| `DATABASE_URL` | Supabase Session Pooler connection string with SSL | **CRITICAL SECRET** |
| `DATABASE_SSL_MODE` | Set to `require` | Safe |
| `OPENROUTER_API_KEY` | OpenRouter bearer token | **CRITICAL SECRET** |
| `OPENROUTER_MODEL` | Explicit free model (`openrouter/free` or `:free` model) | Safe |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Web Application Client ID | Confidential |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret | **CRITICAL SECRET** |
| `GOOGLE_REDIRECT_URI` | Must use production HTTPS callback | Public |
| `GOOGLE_TOKEN_ENCRYPTION_KEY` | 32-byte Base64 key for AES-GCM token encryption at rest | **CRITICAL SECRET** |

---

## 4. HTTPS & OAuth 2.0 Redirect Requirements

- Google OAuth 2.0 **strictly forbids HTTP redirect URIs** in production (only `http://localhost` is permitted during local development).
- The production domain must terminate SSL with a valid TLS certificate before configuring Google Cloud Console authorized redirect URIs.

---

## 5. Supabase Connection Strategy in Cloud Runtimes

- Many low-cost or serverless container hosts (Render, Fly, AWS Lambda) route exclusively over IPv4.
- Direct connections (`aws-0-region.pooler.supabase.com:5432`) fail on IPv4 runtimes because direct Supabase hosts frequently resolve only to IPv6.
- **Rule**: Always configure the **Supabase Session Pooler** (`port 6543`) for cloud runtimes:
  ```
  postgresql+psycopg://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
  ```

---

## 6. Video Storage & Cleanup Lifecycle

- Uploaded MP4 videos are held temporarily in `MEDIA_TEMP_DIR` while metadata is verified and resumable upload to YouTube is executed.
- On completion of `videos.insert` or on fatal validation failure, the local file is unlinked immediately.
- Container storage does not need to be persistent across deployments; state is tracked entirely in the Supabase PostgreSQL database.

---

## 7. Zero-Cost Infrastructure Tier Strategy

To adhere strictly to the zero-budget non-negotiable constraint:
- **Database**: Supabase Free Tier (500MB database, 50,000 monthly active users).
- **Backend**: Free/low-cost container instance (e.g., Render Web Service free instance or Fly.io free tier).
- **Frontend**: Vercel or Cloudflare Pages Free Tier (unlimited bandwidth for personal use).
- **LLM Gateway**: OpenRouter Free Tier models (`:free` suffix).
