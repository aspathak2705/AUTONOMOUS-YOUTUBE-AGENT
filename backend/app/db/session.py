"""Database session and engine lifecycle management.

Never connects during module import. Enforces SSL for Supabase remote databases.
"""

import logging
from typing import Generator, Optional
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker, Session

from app.core.config import Settings, get_settings

logger = logging.getLogger(__name__)

_engine: Optional[Engine] = None
_session_factory: Optional[sessionmaker] = None


def get_engine(settings: Optional[Settings] = None) -> Optional[Engine]:
    """Create or return existing engine singleton if DATABASE_URL configured."""
    global _engine, _session_factory
    if _engine is not None:
        return _engine

    cfg = settings or get_settings()
    if not cfg.is_database_configured or not cfg.DATABASE_URL:
        return None

    connect_args = {
        "connect_timeout": cfg.DATABASE_CONNECT_TIMEOUT,
    }

    # For postgres connections, enforce SSL mode if configured
    if "postgresql" in cfg.DATABASE_URL and cfg.DATABASE_SSL_MODE:
        connect_args["sslmode"] = cfg.DATABASE_SSL_MODE

    try:
        _engine = create_engine(
            cfg.DATABASE_URL,
            pool_size=cfg.DATABASE_POOL_SIZE,
            max_overflow=cfg.DATABASE_MAX_OVERFLOW,
            connect_args=connect_args,
            pool_pre_ping=True,
        )
        _session_factory = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
        return _engine
    except Exception as e:
        logger.error("Failed to initialize database engine: %s", str(e))
        return None


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for database session."""
    engine = get_engine()
    if engine is None or _session_factory is None:
        raise RuntimeError("Database is not configured or engine failed to initialize.")

    session: Session = _session_factory()
    try:
        yield session
    finally:
        session.close()


def check_database_health(settings: Optional[Settings] = None) -> dict:
    """Safely ping database with SELECT 1 and return sanitized status."""
    cfg = settings or get_settings()
    if not cfg.is_database_configured:
        return {
            "status": "not_configured",
            "message": "DATABASE_URL environment variable is not set.",
        }

    try:
        engine = get_engine(cfg)
        if engine is None:
            return {
                "status": "error",
                "message": "Engine failed to initialize with provided parameters.",
            }

        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            return {
                "status": "connected",
                "message": "Database connection verified successfully.",
            }
    except Exception as e:
        # Scrub details to avoid printing credentials or raw hostnames in client response
        error_type = type(e).__name__
        logger.warning("Database health check ping failed: %s", error_type)
        return {
            "status": "unreachable",
            "message": f"Connection failed ({error_type}). Verify network/credentials.",
        }
