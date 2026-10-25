"""FastAPI Application Configuration using Pydantic Settings."""

from functools import lru_cache
from typing import List, Optional
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application Settings
    APP_NAME: str = "autonomous-youtube-agent"
    APP_ENV: str = "development"
    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = 8000
    APP_DEBUG: bool = False
    LOG_LEVEL: str = "INFO"
    API_V1_PREFIX: str = "/api/v1"
    FRONTEND_ORIGIN: str = "http://localhost:5173"

    # Database Settings (Supabase PostgreSQL)
    DATABASE_URL: Optional[str] = None
    DATABASE_SSL_MODE: str = "require"
    DATABASE_CONNECT_TIMEOUT: int = 10
    DATABASE_POOL_SIZE: int = 5
    DATABASE_MAX_OVERFLOW: int = 2

    # OpenRouter LLM Settings
    OPENROUTER_API_KEY: Optional[str] = None
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_MODEL: str = "openrouter/free"
    OPENROUTER_SITE_URL: str = "http://localhost:5173"
    OPENROUTER_APP_NAME: str = "Autonomous YouTube Agent"

    # YouTube Data API / OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/youtube/callback"
    GOOGLE_TOKEN_ENCRYPTION_KEY: Optional[str] = None

    # Scheduling Defaults
    DEFAULT_TIMEZONE: str = "Asia/Kolkata"
    MORNING_WORKFLOW_TIME: str = "07:00"
    LONG_FORM_PUBLISH_TIME: str = "18:00"
    SHORTS_PUBLISH_TIME: str = "12:00"
    REMINDER_LEAD_HOURS: int = 2

    # Media Storage Defaults
    MEDIA_TEMP_DIR: str = "./temp_media"
    MAX_UPLOAD_SIZE_MB: int = 500
    ALLOWED_VIDEO_FORMATS: str = "mp4,mov,mkv"

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    @property
    def cors_origins(self) -> List[str]:
        """Parsed list of allowed CORS origins."""
        return [origin.strip() for origin in self.FRONTEND_ORIGIN.split(",") if origin.strip()]

    @property
    def is_database_configured(self) -> bool:
        """Check if DATABASE_URL is set and non-empty."""
        return bool(self.DATABASE_URL and self.DATABASE_URL.strip())

    @property
    def is_openrouter_configured(self) -> bool:
        """Check if OpenRouter key is set."""
        return bool(self.OPENROUTER_API_KEY and self.OPENROUTER_API_KEY.strip())

    @property
    def is_youtube_configured(self) -> bool:
        """Check if basic YouTube OAuth credentials are configured."""
        return bool(
            self.GOOGLE_CLIENT_ID
            and self.GOOGLE_CLIENT_SECRET
            and self.GOOGLE_CLIENT_ID.strip()
            and self.GOOGLE_CLIENT_SECRET.strip()
        )


@lru_cache()
def get_settings() -> Settings:
    """Return cached application settings singleton."""
    return Settings()
