"""Persistent SQLAlchemy Models for Autonomous YouTube Agent."""

import uuid
from datetime import date, datetime, time, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    Time,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.db.base import Base, GUID, TimestampMixin

# Use JSONB on PostgreSQL, standard JSON fallback on other dialects
SafeJSON = JSON().with_variant(JSONB, "postgresql")


class DayOfWeek(str, Enum):
    MONDAY = "monday"
    TUESDAY = "tuesday"
    WEDNESDAY = "wednesday"
    THURSDAY = "thursday"
    FRIDAY = "friday"
    SATURDAY = "saturday"
    SUNDAY = "sunday"


class ContentPackageStatus(str, Enum):
    PLANNED = "planned"
    RESEARCHING = "researching"
    GENERATING = "generating"
    DRAFTED = "drafted"
    READY_FOR_VIDEO = "ready_for_video"
    VIDEO_ATTACHED = "video_attached"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    FAILED = "failed"


class JobType(str, Enum):
    MORNING_WORKFLOW = "morning_workflow"
    RESEARCH_TOPIC = "research_topic"
    GENERATE_CONTENT = "generate_content"
    VALIDATE_MEDIA = "validate_media"
    PUBLISH_YOUTUBE = "publish_youtube"
    SEND_REMINDER = "send_reminder"


class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class AssetType(str, Enum):
    LONG_FORM_VIDEO = "long_form_video"
    SHORTS_VIDEO = "shorts_video"
    THUMBNAIL_IMAGE = "thumbnail_image"
    CAPTION_FILE = "caption_file"


class AssetStatus(str, Enum):
    UPLOADED = "uploaded"
    VALIDATING = "validating"
    VALID = "valid"
    INVALID = "invalid"


class PublishingStatus(str, Enum):
    PENDING_UPLOAD = "pending_upload"
    UPLOADED_PRIVATE = "uploaded_private"
    SCHEDULED = "scheduled"
    PUBLISHED_PUBLIC = "published_public"
    FAILED = "failed"


class NotificationType(str, Enum):
    VIDEO_DUE_REMINDER = "video_due_reminder"
    WORKFLOW_FAILURE = "workflow_failure"
    PUBLISH_SUCCESS = "publish_success"
    SYSTEM_ALERT = "system_alert"


class NotificationStatus(str, Enum):
    PENDING = "pending"
    DELIVERED = "delivered"
    DISMISSED = "dismissed"


class CreatorProfile(Base, TimestampMixin):
    """Creator application profile and publishing configuration."""

    __tablename__ = "creator_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4
    )
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    primary_niche: Mapped[str] = mapped_column(String(100), nullable=False)
    channel_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    language: Mapped[str] = mapped_column(String(20), default="en", nullable=False)
    target_audience: Mapped[str] = mapped_column(String(255), nullable=False)
    content_style: Mapped[str] = mapped_column(String(255), nullable=False)
    timezone: Mapped[str] = mapped_column(
        String(50), default="Asia/Kolkata", nullable=False
    )
    morning_workflow_time: Mapped[time] = mapped_column(
        Time, default=time(7, 0), nullable=False
    )
    long_form_publish_time: Mapped[time] = mapped_column(
        Time, default=time(18, 0), nullable=False
    )
    shorts_publish_time: Mapped[time] = mapped_column(
        Time, default=time(12, 0), nullable=False
    )
    reminder_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    topic_schedules: Mapped[List["WeeklyTopicSchedule"]] = relationship(
        "WeeklyTopicSchedule", back_populates="creator_profile", cascade="all, delete-orphan"
    )
    content_packages: Mapped[List["ContentPackage"]] = relationship(
        "ContentPackage", back_populates="creator_profile", cascade="all, delete-orphan"
    )
    workflow_jobs: Mapped[List["WorkflowJob"]] = relationship(
        "WorkflowJob", back_populates="creator_profile", cascade="all, delete-orphan"
    )
    notifications: Mapped[List["Notification"]] = relationship(
        "Notification", back_populates="creator_profile", cascade="all, delete-orphan"
    )


class WeeklyTopicSchedule(Base, TimestampMixin):
    """Recurring weekly topic schedule entries for each weekday."""

    __tablename__ = "weekly_topic_schedules"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4
    )
    creator_profile_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("creator_profiles.id", ondelete="CASCADE"), nullable=False
    )
    day_of_week: Mapped[DayOfWeek] = mapped_column(
        SQLEnum(DayOfWeek, name="day_of_week_enum"), nullable=False
    )
    topic: Mapped[str] = mapped_column(String(255), nullable=False)
    subtopic: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    content_focus: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    creator_profile: Mapped["CreatorProfile"] = relationship(
        "CreatorProfile", back_populates="topic_schedules"
    )

    __table_args__ = (
        UniqueConstraint("creator_profile_id", "day_of_week", name="uq_profile_day_of_week"),
        Index("ix_topic_schedule_profile", "creator_profile_id"),
    )


class ContentPackage(Base, TimestampMixin):
    """Unified daily content package containing generated scripts, metadata, and prompts."""

    __tablename__ = "content_packages"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4
    )
    creator_profile_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("creator_profiles.id", ondelete="CASCADE"), nullable=False
    )
    topic: Mapped[str] = mapped_column(String(255), nullable=False)
    content_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[ContentPackageStatus] = mapped_column(
        SQLEnum(ContentPackageStatus, name="content_package_status_enum"),
        default=ContentPackageStatus.PLANNED,
        nullable=False,
    )
    research_bundle: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        SafeJSON, nullable=True
    )
    generated_content: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        SafeJSON, nullable=True
    )
    generation_model: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    generation_attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    creator_profile: Mapped["CreatorProfile"] = relationship(
        "CreatorProfile", back_populates="content_packages"
    )
    workflow_jobs: Mapped[List["WorkflowJob"]] = relationship(
        "WorkflowJob", back_populates="content_package", cascade="all, delete-orphan"
    )
    media_assets: Mapped[List["MediaAsset"]] = relationship(
        "MediaAsset", back_populates="content_package", cascade="all, delete-orphan"
    )
    publishing_records: Mapped[List["PublishingRecord"]] = relationship(
        "PublishingRecord", back_populates="content_package", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("ix_content_package_profile_date", "creator_profile_id", "content_date"),
        Index("ix_content_package_status", "status"),
    )


class WorkflowJob(Base, TimestampMixin):
    """Persistent unit of scheduled background work with idempotency and retry tracking."""

    __tablename__ = "workflow_jobs"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4
    )
    creator_profile_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("creator_profiles.id", ondelete="CASCADE"), nullable=False
    )
    content_package_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID(), ForeignKey("content_packages.id", ondelete="SET NULL"), nullable=True
    )
    job_type: Mapped[JobType] = mapped_column(
        SQLEnum(JobType, name="job_type_enum"), nullable=False
    )
    status: Mapped[JobStatus] = mapped_column(
        SQLEnum(JobStatus, name="job_status_enum"),
        default=JobStatus.PENDING,
        nullable=False,
    )
    scheduled_for: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    started_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    finished_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    attempt_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    max_attempts: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    idempotency_key: Mapped[str] = mapped_column(
        String(128), unique=True, nullable=False
    )
    last_error_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    last_error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    creator_profile: Mapped["CreatorProfile"] = relationship(
        "CreatorProfile", back_populates="workflow_jobs"
    )
    content_package: Mapped[Optional["ContentPackage"]] = relationship(
        "ContentPackage", back_populates="workflow_jobs"
    )

    __table_args__ = (
        Index("ix_workflow_job_scheduled_status", "status", "scheduled_for"),
        Index("ix_workflow_job_idempotency", "idempotency_key"),
    )


class MediaAsset(Base, TimestampMixin):
    """Uploaded media file metadata associated with a content package."""

    __tablename__ = "media_assets"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4
    )
    content_package_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("content_packages.id", ondelete="CASCADE"), nullable=False
    )
    asset_type: Mapped[AssetType] = mapped_column(
        SQLEnum(AssetType, name="asset_type_enum"), nullable=False
    )
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    storage_key: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    checksum_sha256: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    duration_seconds: Mapped[Optional[float]] = mapped_column(nullable=True)
    width: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    height: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    status: Mapped[AssetStatus] = mapped_column(
        SQLEnum(AssetStatus, name="asset_status_enum"),
        default=AssetStatus.UPLOADED,
        nullable=False,
    )

    content_package: Mapped["ContentPackage"] = relationship(
        "ContentPackage", back_populates="media_assets"
    )
    publishing_records: Mapped[List["PublishingRecord"]] = relationship(
        "PublishingRecord", back_populates="media_asset"
    )

    __table_args__ = (
        Index("ix_media_asset_package", "content_package_id"),
    )


class PublishingRecord(Base, TimestampMixin):
    """YouTube publishing operation tracking record."""

    __tablename__ = "publishing_records"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4
    )
    content_package_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("content_packages.id", ondelete="CASCADE"), nullable=False
    )
    media_asset_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID(), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    platform: Mapped[str] = mapped_column(String(50), default="youtube", nullable=False)
    external_video_id: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    intended_privacy_status: Mapped[str] = mapped_column(String(20), default="private", nullable=False)
    intended_publish_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    actual_published_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    status: Mapped[PublishingStatus] = mapped_column(
        SQLEnum(PublishingStatus, name="publishing_status_enum"),
        default=PublishingStatus.PENDING_UPLOAD,
        nullable=False,
    )
    last_error_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    content_package: Mapped["ContentPackage"] = relationship(
        "ContentPackage", back_populates="publishing_records"
    )
    media_asset: Mapped[Optional["MediaAsset"]] = relationship(
        "MediaAsset", back_populates="publishing_records"
    )

    __table_args__ = (
        Index("ix_publishing_record_package", "content_package_id"),
        Index("ix_publishing_record_external_id", "external_video_id"),
    )


class Notification(Base, TimestampMixin):
    """Operational notification and creator reminder record."""

    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4
    )
    creator_profile_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("creator_profiles.id", ondelete="CASCADE"), nullable=False
    )
    workflow_job_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID(), ForeignKey("workflow_jobs.id", ondelete="SET NULL"), nullable=True
    )
    notification_type: Mapped[NotificationType] = mapped_column(
        SQLEnum(NotificationType, name="notification_type_enum"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[NotificationStatus] = mapped_column(
        SQLEnum(NotificationStatus, name="notification_status_enum"),
        default=NotificationStatus.PENDING,
        nullable=False,
    )
    scheduled_for: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    delivered_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    creator_profile: Mapped["CreatorProfile"] = relationship(
        "CreatorProfile", back_populates="notifications"
    )

    __table_args__ = (
        Index("ix_notification_profile_status", "creator_profile_id", "status"),
    )
