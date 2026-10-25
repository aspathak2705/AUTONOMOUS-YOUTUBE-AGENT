# AGENTS.md — Permanent Engineering Conventions & Rules

These non-negotiable guidelines govern all development on `autonomous-youtube-agent`.

---

## 1. Architectural Integrity & Modularity
- **Modular Monolith**: Maintain clean boundaries between domains (`profile`, `scheduler`, `research`, `content_generation`, `media`, `captions`, `thumbnails`, `youtube`, `reminders`).
- **Thin Route Handlers**: Route handlers must only validate requests, invoke appropriate services, and serialize responses. Keep business logic strictly within service layer.
- **Provider Abstraction**: All external gateways (OpenRouter LLM, YouTube Data API, Research retrieval) must sit behind explicit abstract base interfaces (e.g. `LLMProvider`). Never couple services directly to 3rd-party vendor SDKs.

## 2. Constraints & Budget (Zero-Paid-API Rule)
- **Zero Paid APIs**: The project must operate under a zero-cost API budget until monetization. Never introduce paid APIs or credit purchases.
- **Explicit Free Models**: Only use models tagged with `:free` or the `openrouter/free` router.
- **No Automatic Paid Fallbacks**: If a free model is unavailable or rate-limited, fail safely with an explanatory error. NEVER fall back to a paid model.
- **One LLM Request per Content Package**: Daily content generation (long-form script, Shorts script, titles, descriptions, hashtags, thumbnail prompts, narration) must be requested in a single structured LLM call.
- **Human-Generated Video**: The user manually creates videos using external tools. Never configure paid video generation APIs.

## 3. Workflow & Containerization Strategy
- **No Docker Requirement**: Docker is explicitly removed from development workflow. Run backend directly through Python venv and frontend via Node.js/npm. Never make Docker or local PostgreSQL containerization mandatory.
- **Direct Execution**: Support direct local execution and remote Supabase PostgreSQL connectivity.

## 4. Frontend Visual Identity & Design System
- **Retro YouTube Studio Design System**: The entire application frontend must follow the retro studio design system inspired by 1990s/early-2000s web interfaces.
- **Design Tokens**: All styling must use central theme CSS variables (`--bg-space`, `--card-cream`, `--accent-orange`, `--accent-teal`, `--border-purple`, etc.).
- **No Generic Templates**: Never introduce generic SaaS admin dashboard templates or unstyled wireframes.
- **Honest UI**: Never fabricate or hardcode successful production metrics or fake published items.

## 5. Security & Credentials
- **No Secrets in Code**: Never commit API keys, Google client secrets, database passwords, refresh tokens, or Fernet encryption keys.
- **Frontend Isolation**: Never expose backend secrets, database URLs, or OAuth secrets via browser-safe environment variables (`VITE_`).
- **No Secrets in Logs or Output**: Sanitize log records, diagnostic outputs, and API error responses. Scrub credentials, access tokens, and raw connection URIs.
- **Safe SQL**: Always use SQLAlchemy parameter binding and Alembic migrations. Never execute arbitrary or destructive SQL queries automatically.

## 6. Code Quality & Type Safety
- **Strict Typing**:
  - Python: Use complete type hints (`pydantic` models for schemas, typing primitives for function signatures).
  - TypeScript: Strict mode (`noImplicitAny`, `noUnusedLocals`, `strictNullChecks`).
- **Testing**:
  - Unit tests must mock external network calls. Default test suites must NEVER execute live external API calls or incur quotas.
  - Run tests and static checks (`pytest`, `py_compile`, linting) before marking tasks complete.
- **Honest Verification**:
  - Never report a 3rd-party integration as functional merely because client libraries are installed or environment variables exist.
  - Distinguish between locally verified code and external dependencies blocked by developer account setup.
