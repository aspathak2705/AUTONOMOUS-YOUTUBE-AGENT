"""Pydantic schemas for health and system responses."""

from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class RootInfoResponse(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "autonomous-youtube-agent"})
    status: str = Field(..., json_schema_extra={"example": "running"})
    version: str = Field(..., json_schema_extra={"example": "0.1.0"})
    environment: str = Field(..., json_schema_extra={"example": "development"})


class LiveHealthResponse(BaseModel):
    status: str = Field(default="live", json_schema_extra={"example": "live"})
    timestamp: str


class ReadinessCheckDetails(BaseModel):
    configuration: str
    database: str
    openrouter: str
    youtube: str


class ReadyHealthResponse(BaseModel):
    status: str = Field(..., json_schema_extra={"example": "ready"})
    checks: ReadinessCheckDetails


class DependencyCheckItem(BaseModel):
    configured: bool
    status: str
    details: Optional[str] = None


class DependenciesHealthResponse(BaseModel):
    database: DependencyCheckItem
    openrouter: DependencyCheckItem
    youtube: DependencyCheckItem


class ErrorResponse(BaseModel):
    error: str
    message: str
    request_id: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
