"""FastAPI Application Factory."""

import logging
import time
import uuid
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import api_router
from app.core.config import Settings, get_settings
from app.core.logging import setup_logging
from app.schemas.health import ErrorResponse, RootInfoResponse

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Clean startup and shutdown handler."""
    settings = get_settings()
    setup_logging(settings.LOG_LEVEL)
    logger.info("Starting up %s (env=%s, debug=%s)", settings.APP_NAME, settings.APP_ENV, settings.APP_DEBUG)
    yield
    logger.info("Shutting down %s", settings.APP_NAME)


def create_app(settings: Settings | None = None) -> FastAPI:
    """Application factory for FastAPI app."""
    app_settings = settings or get_settings()

    app = FastAPI(
        title=app_settings.APP_NAME,
        version="0.1.0",
        description="Autonomous YouTube Agent API (Phase 0 Foundation)",
        lifespan=lifespan,
        docs_url="/docs" if app_settings.APP_DEBUG else None,
        redoc_url=None,
    )

    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=app_settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    # Request ID and timing correlation middleware
    @app.middleware("http")
    async def request_middleware(request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        start_time = time.time()
        
        # Set on request state for access in route handlers
        request.state.request_id = request_id

        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000

        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
        return response

    # Global Exception Handlers
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        request_id = getattr(request.state, "request_id", "unknown")
        logger.error("Unhandled exception on %s %s [req_id=%s]: %s", request.method, request.url.path, request_id, str(exc))
        
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=ErrorResponse(
                error="internal_server_error",
                message="An unexpected server error occurred. Diagnostic logged.",
                request_id=request_id,
            ).model_dump(),
        )

    # Root Endpoint
    @app.get("/", response_model=RootInfoResponse, tags=["system"], summary="System Overview")
    def get_root():
        return RootInfoResponse(
            name=app_settings.APP_NAME,
            status="running",
            version="0.1.0",
            environment=app_settings.APP_ENV,
        )

    # Mount API routers
    app.include_router(api_router, prefix=app_settings.API_V1_PREFIX)

    return app


app = create_app()
