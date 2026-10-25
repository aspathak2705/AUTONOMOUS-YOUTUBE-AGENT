"""Repository layer for CreatorProfile and WeeklyTopicSchedule."""

import uuid
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.entities import CreatorProfile, DayOfWeek, WeeklyTopicSchedule
from app.schemas.profile import (
    CreatorProfileCreate,
    CreatorProfileUpdate,
    WeeklyTopicScheduleCreate,
    WeeklyTopicScheduleUpdate,
)


class ProfileRepository:
    """Encapsulates database operations for creator profiles."""

    def __init__(self, db: Session):
        self.db = db

    def get_first_profile(self) -> Optional[CreatorProfile]:
        """Fetch the primary creator profile (single-creator architecture)."""
        stmt = select(CreatorProfile).limit(1)
        return self.db.execute(stmt).scalars().first()

    def get_by_id(self, profile_id: uuid.UUID) -> Optional[CreatorProfile]:
        return self.db.get(CreatorProfile, profile_id)

    def create(self, data: CreatorProfileCreate) -> CreatorProfile:
        profile = CreatorProfile(**data.model_dump())
        self.db.add(profile)
        self.db.flush()
        return profile

    def update(self, profile: CreatorProfile, data: CreatorProfileUpdate) -> CreatorProfile:
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(profile, field, value)
        self.db.flush()
        return profile


class TopicScheduleRepository:
    """Encapsulates database operations for weekly topic schedules."""

    def __init__(self, db: Session):
        self.db = db

    def list_by_profile(self, profile_id: uuid.UUID) -> List[WeeklyTopicSchedule]:
        stmt = select(WeeklyTopicSchedule).where(
            WeeklyTopicSchedule.creator_profile_id == profile_id
        ).order_by(WeeklyTopicSchedule.day_of_week)
        return list(self.db.execute(stmt).scalars().all())

    def get_by_day(self, profile_id: uuid.UUID, day: DayOfWeek) -> Optional[WeeklyTopicSchedule]:
        stmt = select(WeeklyTopicSchedule).where(
            WeeklyTopicSchedule.creator_profile_id == profile_id,
            WeeklyTopicSchedule.day_of_week == day,
        )
        return self.db.execute(stmt).scalars().first()

    def get_by_id(self, schedule_id: uuid.UUID) -> Optional[WeeklyTopicSchedule]:
        return self.db.get(WeeklyTopicSchedule, schedule_id)

    def create(self, profile_id: uuid.UUID, data: WeeklyTopicScheduleCreate) -> WeeklyTopicSchedule:
        entry = WeeklyTopicSchedule(
            creator_profile_id=profile_id,
            **data.model_dump(),
        )
        self.db.add(entry)
        self.db.flush()
        return entry

    def update(
        self, entry: WeeklyTopicSchedule, data: WeeklyTopicScheduleUpdate
    ) -> WeeklyTopicSchedule:
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(entry, field, value)
        self.db.flush()
        return entry

    def delete(self, entry: WeeklyTopicSchedule) -> None:
        self.db.delete(entry)
        self.db.flush()
