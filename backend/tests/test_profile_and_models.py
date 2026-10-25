"""Comprehensive unit tests for models, repositories, timezone validation, and API routes."""

import uuid
from datetime import datetime, time, timezone
import pytest
from fastapi import status
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.routes.profile import get_profile_service
from app.core.config import Settings
from app.db.base import Base
from app.db.session import get_db
from app.main import create_app
from app.models.entities import CreatorProfile, DayOfWeek, WeeklyTopicSchedule
from app.schemas.profile import (
    CreatorProfileCreate,
    CreatorProfileUpdate,
    WeeklyTopicScheduleCreate,
)
from app.services.profile_service import ProfileService


@pytest.fixture
def in_memory_db():
    """Isolated SQLite in-memory engine and session for unit testing business logic."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


def test_timezone_validation_success():
    profile = CreatorProfileCreate(
        display_name="Test Creator",
        primary_niche="Technology",
        target_audience="Software Developers",
        content_style="Direct, hands-on",
        timezone="Asia/Kolkata",
    )
    assert profile.timezone == "Asia/Kolkata"


def test_timezone_validation_failure():
    with pytest.raises(ValueError, match="Invalid IANA timezone"):
        CreatorProfileCreate(
            display_name="Test Creator",
            primary_niche="Technology",
            target_audience="Software Developers",
            content_style="Direct, hands-on",
            timezone="Invalid/Timezone_Name",
        )


def test_profile_service_lifecycle(in_memory_db):
    service = ProfileService(in_memory_db)
    
    # 1. Auto-create default
    profile = service.get_or_create_default_profile()
    assert profile.display_name == "Solo Creator"
    assert profile.timezone == "Asia/Kolkata"
    
    # 2. Update profile
    updated = service.update_profile(CreatorProfileUpdate(display_name="Alex River", timezone="UTC"))
    assert updated.display_name == "Alex River"
    assert updated.timezone == "UTC"

    # 3. Schedule upsert
    schedule = service.upsert_topic_schedule(
        WeeklyTopicScheduleCreate(
            day_of_week=DayOfWeek.MONDAY,
            topic="Autonomous AI Systems",
            subtopic="Agent design patterns",
        )
    )
    assert schedule.topic == "Autonomous AI Systems"
    assert schedule.day_of_week == DayOfWeek.MONDAY

    # 4. List schedules
    schedules = service.list_topic_schedules()
    assert len(schedules) == 1
    assert schedules[0].topic == "Autonomous AI Systems"

    # 5. Delete schedule
    deleted = service.delete_topic_schedule(schedule.id)
    assert deleted is True
    assert len(service.list_topic_schedules()) == 0


def test_profile_api_endpoints(in_memory_db):
    settings = Settings(DATABASE_URL=None)
    app = create_app(settings)
    
    # Override get_db dependency
    app.dependency_overrides[get_db] = lambda: in_memory_db

    # Manually test handlers or via direct call
    service = ProfileService(in_memory_db)
    app.dependency_overrides[get_profile_service] = lambda: service

    from app.api.routes.profile import get_creator_profile, list_topic_schedules, upsert_topic_schedule
    
    res = get_creator_profile(service=service)
    assert res.display_name == "Solo Creator"

    created_sched = upsert_topic_schedule(
        data=WeeklyTopicScheduleCreate(
            day_of_week=DayOfWeek.WEDNESDAY,
            topic="Vector Databases & Retrieval",
        ),
        service=service,
    )
    assert created_sched.day_of_week == DayOfWeek.WEDNESDAY

    all_scheds = list_topic_schedules(service=service)
    assert len(all_scheds) == 1
    assert all_scheds[0].topic == "Vector Databases & Retrieval"
