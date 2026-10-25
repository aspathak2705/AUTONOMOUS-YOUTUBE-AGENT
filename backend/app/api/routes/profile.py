"""Creator Profile and Weekly Topic Schedule API Routes."""

import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.profile import (
    CreatorProfileResponse,
    CreatorProfileUpdate,
    WeeklyTopicScheduleCreate,
    WeeklyTopicScheduleResponse,
)
from app.services.profile_service import ProfileService

router = APIRouter(prefix="/profile", tags=["profile"])


def get_profile_service(db: Session = Depends(get_db)) -> ProfileService:
    """FastAPI dependency for ProfileService."""
    return ProfileService(db)


@router.get("", response_model=CreatorProfileResponse, summary="Get Creator Profile")
def get_creator_profile(
    service: ProfileService = Depends(get_profile_service),
) -> CreatorProfileResponse:
    """Retrieve creator profile. Creates default profile if not present."""
    return service.get_or_create_default_profile()


@router.patch("", response_model=CreatorProfileResponse, summary="Update Creator Profile")
def update_creator_profile(
    data: CreatorProfileUpdate,
    service: ProfileService = Depends(get_profile_service),
) -> CreatorProfileResponse:
    """Update settings on creator profile with timezone and time validation."""
    return service.update_profile(data)


@router.get("/schedules", response_model=List[WeeklyTopicScheduleResponse], summary="List Weekly Topic Schedules")
def list_topic_schedules(
    service: ProfileService = Depends(get_profile_service),
) -> List[WeeklyTopicScheduleResponse]:
    """List recurring weekly topic schedules configured for creator profile."""
    return service.list_topic_schedules()


@router.post("/schedules", response_model=WeeklyTopicScheduleResponse, summary="Upsert Weekly Topic Schedule")
def upsert_topic_schedule(
    data: WeeklyTopicScheduleCreate,
    service: ProfileService = Depends(get_profile_service),
) -> WeeklyTopicScheduleResponse:
    """Create or update a topic schedule for a specific day of the week."""
    return service.upsert_topic_schedule(data)


@router.delete("/schedules/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Topic Schedule")
def delete_topic_schedule(
    schedule_id: uuid.UUID,
    service: ProfileService = Depends(get_profile_service),
) -> None:
    """Delete a topic schedule entry by ID."""
    deleted = service.delete_topic_schedule(schedule_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Topic schedule with id {schedule_id} not found.",
        )
