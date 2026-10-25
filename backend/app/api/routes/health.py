"""Health and diagnostics API endpoints."""

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Response, status

from app.core.config import Settings, get_settings
from app.db.session import check_database_health
from app.schemas.health import (
    DependenciesHealthResponse,
    DependencyCheckItem,
    LiveHealthResponse,
    ReadinessCheckDetails,
    ReadyHealthResponse,
)

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/live", response_model=LiveHealthResponse, summary="Process Liveness Check")
def get_liveness() -> LiveHealthResponse:
    """Indicates if the application process is running.

    Does not depend on database or external services.
    """
    return LiveHealthResponse(
        status="live",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@router.get("/ready", response_model=ReadyHealthResponse, summary="Application Readiness Check")
def get_readiness(
    response: Response,
    settings: Settings = Depends(get_settings),
) -> ReadyHealthResponse:
    """Evaluates readiness to serve operations requiring database dependencies."""
    db_health = check_database_health(settings)
    db_ready = db_health["status"] == "connected"

    # In Phase 0: If DB is not configured, report not_ready with status code 503
    overall_status = "ready" if db_ready else "not_ready"
    if not db_ready:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return ReadyHealthResponse(
        status=overall_status,
        checks=ReadinessCheckDetails(
            configuration="ok",
            database=db_health["status"],
            openrouter="configured" if settings.is_openrouter_configured else "not_configured",
            youtube="configured" if settings.is_youtube_configured else "not_configured",
        ),
    )


@router.get("/dependencies", response_model=DependenciesHealthResponse, summary="Dependency Configuration Status")
def get_dependencies_status(
    settings: Settings = Depends(get_settings),
) -> DependenciesHealthResponse:
    """Safe status report of configured dependencies without leaking secrets."""
    db_health = check_database_health(settings)

    return DependenciesHealthResponse(
        database=DependencyCheckItem(
            configured=settings.is_database_configured,
            status=db_health["status"],
            details=db_health["message"],
        ),
        openrouter=DependencyCheckItem(
            configured=settings.is_openrouter_configured,
            status="configured" if settings.is_openrouter_configured else "not_configured",
            details="Free model gateway: " + (settings.OPENROUTER_MODEL if settings.is_openrouter_configured else "none"),
        ),
        youtube=DependencyCheckItem(
            configured=settings.is_youtube_configured,
            status="configured" if settings.is_youtube_configured else "not_configured",
            details="OAuth client ID registered" if settings.is_youtube_configured else "Google OAuth credentials missing",
        ),
    )
