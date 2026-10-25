"""Pydantic schemas for Creator Profile and Weekly Topic Schedule."""

import re
import uuid
from datetime import datetime, time
from typing import List, Optional
import zoneinfo
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.entities import DayOfWeek


class CreatorProfileBase(BaseModel):
    display_name: str = Field(..., min_length=2, max_length=100, json_schema_extra={"example": "Jane Doe"})
    primary_niche: str = Field(..., min_length=2, max_length=100, json_schema_extra={"example": "AI Engineering"})
    channel_name: Optional[str] = Field(None, max_length=100, json_schema_extra={"example": "AI Engineering Daily"})
    language: str = Field("en", max_length=20, json_schema_extra={"example": "en"})
    target_audience: str = Field(..., min_length=5, max_length=255, json_schema_extra={"example": "Software developers and AI enthusiasts"})
    content_style: str = Field(..., min_length=5, max_length=255, json_schema_extra={"example": "Educational, structured, code-first"})
    timezone: str = Field("Asia/Kolkata", max_length=50, json_schema_extra={"example": "Asia/Kolkata"})
    morning_workflow_time: time = Field(time(7, 0), json_schema_extra={"example": "07:00:00"})
    long_form_publish_time: time = Field(time(18, 0), json_schema_extra={"example": "18:00:00"})
    shorts_publish_time: time = Field(time(12, 0), json_schema_extra={"example": "12:00:00"})
    reminder_enabled: bool = True
    is_active: bool = True

    @field_validator("timezone")
    @classmethod
    def validate_iana_timezone(cls, v: str) -> str:
        try:
            zoneinfo.ZoneInfo(v)
            return v
        except Exception:
            raise ValueError(f"Invalid IANA timezone identifier: {v}")


class CreatorProfileCreate(CreatorProfileBase):
    pass


class CreatorProfileUpdate(BaseModel):
    display_name: Optional[str] = Field(None, min_length=2, max_length=100)
    primary_niche: Optional[str] = Field(None, min_length=2, max_length=100)
    channel_name: Optional[str] = Field(None, max_length=100)
    language: Optional[str] = Field(None, max_length=20)
    target_audience: Optional[str] = Field(None, min_length=5, max_length=255)
    content_style: Optional[str] = Field(None, min_length=5, max_length=255)
    timezone: Optional[str] = Field(None, max_length=50)
    morning_workflow_time: Optional[time] = None
    long_form_publish_time: Optional[time] = None
    shorts_publish_time: Optional[time] = None
    reminder_enabled: Optional[bool] = None
    is_active: Optional[bool] = None

    @field_validator("timezone")
    @classmethod
    def validate_iana_timezone(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            try:
                zoneinfo.ZoneInfo(v)
            except Exception:
                raise ValueError(f"Invalid IANA timezone identifier: {v}")
        return v


class CreatorProfileResponse(CreatorProfileBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WeeklyTopicScheduleBase(BaseModel):
    day_of_week: DayOfWeek = Field(..., json_schema_extra={"example": "monday"})
    topic: str = Field(..., min_length=3, max_length=255, json_schema_extra={"example": "LangChain vs AutoGen Deep Dive"})
    subtopic: Optional[str] = Field(None, max_length=255, json_schema_extra={"example": "Agent memory benchmarks"})
    content_focus: Optional[str] = Field(None, max_length=255, json_schema_extra={"example": "Hands-on code architecture"})
    is_enabled: bool = True


class WeeklyTopicScheduleCreate(WeeklyTopicScheduleBase):
    pass


class WeeklyTopicScheduleUpdate(BaseModel):
    topic: Optional[str] = Field(None, min_length=3, max_length=255)
    subtopic: Optional[str] = Field(None, max_length=255)
    content_focus: Optional[str] = Field(None, max_length=255)
    is_enabled: Optional[bool] = None


class WeeklyTopicScheduleResponse(WeeklyTopicScheduleBase):
    id: uuid.UUID
    creator_profile_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
