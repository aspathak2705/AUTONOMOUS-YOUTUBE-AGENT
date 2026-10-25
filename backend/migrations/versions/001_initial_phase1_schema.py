"""Create initial Phase 1 application schema

Revision ID: 001_initial_phase1_schema
Revises: 
Create Date: 2026-10-25 10:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from app.db.base import GUID

# revision identifiers, used by Alembic.
revision: str = '001_initial_phase1_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. creator_profiles
    op.create_table(
        'creator_profiles',
        sa.Column('id', GUID(), nullable=False),
        sa.Column('display_name', sa.String(length=100), nullable=False),
        sa.Column('primary_niche', sa.String(length=100), nullable=False),
        sa.Column('channel_name', sa.String(length=100), nullable=True),
        sa.Column('language', sa.String(length=20), nullable=False, server_default='en'),
        sa.Column('target_audience', sa.String(length=255), nullable=False),
        sa.Column('content_style', sa.String(length=255), nullable=False),
        sa.Column('timezone', sa.String(length=50), nullable=False, server_default='Asia/Kolkata'),
        sa.Column('morning_workflow_time', sa.Time(), nullable=False),
        sa.Column('long_form_publish_time', sa.Time(), nullable=False),
        sa.Column('shorts_publish_time', sa.Time(), nullable=False),
        sa.Column('reminder_enabled', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # 2. weekly_topic_schedules
    op.create_table(
        'weekly_topic_schedules',
        sa.Column('id', GUID(), nullable=False),
        sa.Column('creator_profile_id', GUID(), nullable=False),
        sa.Column('day_of_week', sa.Enum('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', name='day_of_week_enum'), nullable=False),
        sa.Column('topic', sa.String(length=255), nullable=False),
        sa.Column('subtopic', sa.String(length=255), nullable=True),
        sa.Column('content_focus', sa.String(length=255), nullable=True),
        sa.Column('is_enabled', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['creator_profile_id'], ['creator_profiles.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('creator_profile_id', 'day_of_week', name='uq_profile_day_of_week')
    )
    op.create_index('ix_topic_schedule_profile', 'weekly_topic_schedules', ['creator_profile_id'], unique=False)

    # 3. content_packages
    op.create_table(
        'content_packages',
        sa.Column('id', GUID(), nullable=False),
        sa.Column('creator_profile_id', GUID(), nullable=False),
        sa.Column('topic', sa.String(length=255), nullable=False),
        sa.Column('content_date', sa.Date(), nullable=False),
        sa.Column('status', sa.Enum('planned', 'researching', 'generating', 'drafted', 'ready_for_video', 'video_attached', 'scheduled', 'published', 'failed', name='content_package_status_enum'), nullable=False),
        sa.Column('research_bundle', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('generated_content', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('generation_model', sa.String(length=100), nullable=True),
        sa.Column('generation_attempts', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['creator_profile_id'], ['creator_profiles.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_content_package_profile_date', 'content_packages', ['creator_profile_id', 'content_date'], unique=False)
    op.create_index('ix_content_package_status', 'content_packages', ['status'], unique=False)

    # 4. workflow_jobs
    op.create_table(
        'workflow_jobs',
        sa.Column('id', GUID(), nullable=False),
        sa.Column('creator_profile_id', GUID(), nullable=False),
        sa.Column('content_package_id', GUID(), nullable=True),
        sa.Column('job_type', sa.Enum('morning_workflow', 'research_topic', 'generate_content', 'validate_media', 'publish_youtube', 'send_reminder', name='job_type_enum'), nullable=False),
        sa.Column('status', sa.Enum('pending', 'running', 'completed', 'failed', 'cancelled', name='job_status_enum'), nullable=False),
        sa.Column('scheduled_for', sa.DateTime(timezone=True), nullable=False),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('finished_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('attempt_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('max_attempts', sa.Integer(), nullable=False, server_default='3'),
        sa.Column('idempotency_key', sa.String(length=128), nullable=False),
        sa.Column('last_error_code', sa.String(length=50), nullable=True),
        sa.Column('last_error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['content_package_id'], ['content_packages.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['creator_profile_id'], ['creator_profiles.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('idempotency_key')
    )
    op.create_index('ix_workflow_job_idempotency', 'workflow_jobs', ['idempotency_key'], unique=False)
    op.create_index('ix_workflow_job_scheduled_status', 'workflow_jobs', ['status', 'scheduled_for'], unique=False)

    # 5. media_assets
    op.create_table(
        'media_assets',
        sa.Column('id', GUID(), nullable=False),
        sa.Column('content_package_id', GUID(), nullable=False),
        sa.Column('asset_type', sa.Enum('long_form_video', 'shorts_video', 'thumbnail_image', 'caption_file', name='asset_type_enum'), nullable=False),
        sa.Column('original_filename', sa.String(length=255), nullable=False),
        sa.Column('storage_key', sa.String(length=512), nullable=True),
        sa.Column('mime_type', sa.String(length=100), nullable=False),
        sa.Column('file_size_bytes', sa.Integer(), nullable=False),
        sa.Column('checksum_sha256', sa.String(length=64), nullable=True),
        sa.Column('duration_seconds', sa.Float(), nullable=True),
        sa.Column('width', sa.Integer(), nullable=True),
        sa.Column('height', sa.Integer(), nullable=True),
        sa.Column('status', sa.Enum('uploaded', 'validating', 'valid', 'invalid', name='asset_status_enum'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['content_package_id'], ['content_packages.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_media_asset_package', 'media_assets', ['content_package_id'], unique=False)

    # 6. publishing_records
    op.create_table(
        'publishing_records',
        sa.Column('id', GUID(), nullable=False),
        sa.Column('content_package_id', GUID(), nullable=False),
        sa.Column('media_asset_id', GUID(), nullable=True),
        sa.Column('platform', sa.String(length=50), nullable=False, server_default='youtube'),
        sa.Column('external_video_id', sa.String(length=50), nullable=True),
        sa.Column('intended_privacy_status', sa.String(length=20), nullable=False, server_default='private'),
        sa.Column('intended_publish_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('actual_published_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('status', sa.Enum('pending_upload', 'uploaded_private', 'scheduled', 'published_public', 'failed', name='publishing_status_enum'), nullable=False),
        sa.Column('last_error_code', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['content_package_id'], ['content_packages.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['media_asset_id'], ['media_assets.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_publishing_record_external_id', 'publishing_records', ['external_video_id'], unique=False)
    op.create_index('ix_publishing_record_package', 'publishing_records', ['content_package_id'], unique=False)

    # 7. notifications
    op.create_table(
        'notifications',
        sa.Column('id', GUID(), nullable=False),
        sa.Column('creator_profile_id', GUID(), nullable=False),
        sa.Column('workflow_job_id', GUID(), nullable=True),
        sa.Column('notification_type', sa.Enum('video_due_reminder', 'workflow_failure', 'publish_success', 'system_alert', name='notification_type_enum'), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('status', sa.Enum('pending', 'delivered', 'dismissed', name='notification_status_enum'), nullable=False),
        sa.Column('scheduled_for', sa.DateTime(timezone=True), nullable=True),
        sa.Column('delivered_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['creator_profile_id'], ['creator_profiles.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['workflow_job_id'], ['workflow_jobs.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_notification_profile_status', 'notifications', ['creator_profile_id', 'status'], unique=False)


def downgrade() -> None:
    op.drop_table('notifications')
    op.drop_table('publishing_records')
    op.drop_table('media_assets')
    op.drop_table('workflow_jobs')
    op.drop_table('content_packages')
    op.drop_table('weekly_topic_schedules')
    op.drop_table('creator_profiles')

    # Drop Enums
    bind = op.get_bind()
    if bind.dialect.name == 'postgresql':
        op.execute('DROP TYPE IF EXISTS notification_status_enum')
        op.execute('DROP TYPE IF EXISTS notification_type_enum')
        op.execute('DROP TYPE IF EXISTS publishing_status_enum')
        op.execute('DROP TYPE IF EXISTS asset_status_enum')
        op.execute('DROP TYPE IF EXISTS asset_type_enum')
        op.execute('DROP TYPE IF EXISTS job_status_enum')
        op.execute('DROP TYPE IF EXISTS job_type_enum')
        op.execute('DROP TYPE IF EXISTS content_package_status_enum')
        op.execute('DROP TYPE IF EXISTS day_of_week_enum')
