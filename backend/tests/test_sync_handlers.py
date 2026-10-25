"""Direct synchronous unit tests for route handlers and configuration.

Avoids background async server timeouts in restricted sandbox runtimes.
"""

import pytest
from fastapi import Response, status

from app.api.routes.health import get_dependencies_status, get_liveness, get_readiness
from app.core.config import Settings
from app.db.session import check_database_health


def test_configuration_defaults() -> None:
    s = Settings(
        DATABASE_URL=None,
        OPENROUTER_API_KEY=None,
        GOOGLE_CLIENT_ID=None,
        GOOGLE_CLIENT_SECRET=None,
    )
    assert s.APP_NAME == "autonomous-youtube-agent"
    assert s.DEFAULT_TIMEZONE == "Asia/Kolkata"
    assert s.is_database_configured is False
    assert s.is_openrouter_configured is False
    assert s.is_youtube_configured is False
    assert "http://localhost:5173" in s.cors_origins


def test_cors_origin_parsing() -> None:
    s = Settings(FRONTEND_ORIGIN="http://localhost:5173, https://app.example.com")
    assert len(s.cors_origins) == 2
    assert "http://localhost:5173" in s.cors_origins
    assert "https://app.example.com" in s.cors_origins


def test_liveness_handler() -> None:
    res = get_liveness()
    assert res.status == "live"
    assert res.timestamp is not None


def test_readiness_handler_unconfigured() -> None:
    s = Settings(DATABASE_URL=None)
    response = Response()
    res = get_readiness(response=response, settings=s)
    assert res.status == "not_ready"
    assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
    assert res.checks.database == "not_configured"
    assert res.checks.openrouter == "not_configured"
    assert res.checks.youtube == "not_configured"


def test_dependencies_handler_unconfigured() -> None:
    s = Settings(
        DATABASE_URL=None,
        OPENROUTER_API_KEY=None,
        GOOGLE_CLIENT_ID=None,
        GOOGLE_CLIENT_SECRET=None,
    )
    res = get_dependencies_status(settings=s)
    assert res.database.configured is False
    assert res.database.status == "not_configured"
    assert res.openrouter.configured is False
    assert res.youtube.configured is False


def test_check_database_health_unconfigured() -> None:
    s = Settings(DATABASE_URL=None)
    res = check_database_health(settings=s)
    assert res["status"] == "not_configured"
    assert "not set" in res["message"]
