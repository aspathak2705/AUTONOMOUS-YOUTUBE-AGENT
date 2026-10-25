"""Profile Service encapsulating creator configuration business logic."""

import uuid
from typing import List, Optional
from sqlalchemy.orm import Session

from app.db.repositories import ProfileRepository, TopicScheduleRepository
from app.models.entities import CreatorProfile, DayOfWeek, WeeklyTopicSchedule
from app.schemas.profile import (
    CreatorProfileCreate,
    CreatorProfileUpdate,
    WeeklyTopicScheduleCreate,
    WeeklyTopicScheduleUpdate,
)


class ProfileService:
    """Business service for managing creator profile and weekly topic schedules.

    Owns transaction commit boundaries.
    """

    def __init__(self, db: Session):
        self.db = db
        self.profile_repo = ProfileRepository(db)
        self.schedule_repo = TopicScheduleRepository(db)

    def get_or_create_default_profile(self) -> CreatorProfile:
        """Fetch existing profile or initialize a sensible default profile."""
        profile = self.profile_repo.get_first_profile()
        if profile is None:
            default_data = CreatorProfileCreate(
                display_name="Solo Creator",
                primary_niche="Technology & AI",
                channel_name=None,
                language="en",
                target_audience="Software engineers and tech enthusiasts",
                content_style="Informative, hands-on, high-density walkthroughs",
                timezone="Asia/Kolkata",
            )
            profile = self.profile_repo.create(default_data)
            self.db.commit()
            self.db.refresh(profile)
        return profile

    def update_profile(self, data: CreatorProfileUpdate) -> CreatorProfile:
        profile = self.get_or_create_default_profile()
        updated = self.profile_repo.update(profile, data)
        self.db.commit()
        self.db.refresh(updated)
        return updated

    def list_topic_schedules(self) -> List[WeeklyTopicSchedule]:
        profile = self.get_or_create_default_profile()
        return self.schedule_repo.list_by_profile(profile.id)

    def upsert_topic_schedule(
        self, data: WeeklyTopicScheduleCreate
    ) -> WeeklyTopicSchedule:
        profile = self.get_or_create_default_profile()
        existing = self.schedule_repo.get_by_day(profile.id, data.day_of_week)
        if existing:
            update_data = WeeklyTopicScheduleUpdate(
                topic=data.topic,
                subtopic=data.subtopic,
                content_focus=data.content_focus,
                is_enabled=data.is_enabled,
            )
            updated = self.schedule_repo.update(existing, update_data)
            self.db.commit()
            self.db.refresh(updated)
            return updated
        else:
            created = self.schedule_repo.create(profile.id, data)
            self.db.commit()
            self.db.refresh(created)
            return created

    def delete_topic_schedule(self, schedule_id: uuid.UUID) -> bool:
        entry = self.schedule_repo.get_by_id(schedule_id)
        if entry is None:
            return False
        self.schedule_repo.delete(entry)
        self.db.commit()
        return True
