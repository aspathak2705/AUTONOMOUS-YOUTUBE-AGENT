import { DependenciesHealth, LiveHealth, ReadyHealth, RootInfo } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface CreatorProfile {
  id: string;
  display_name: string;
  primary_niche: string;
  channel_name: string | null;
  language: string;
  target_audience: string;
  content_style: string;
  timezone: string;
  morning_workflow_time: string;
  long_form_publish_time: string;
  shorts_publish_time: string;
  reminder_enabled: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeeklyTopicSchedule {
  id: string;
  creator_profile_id: string;
  day_of_week: string;
  topic: string;
  subtopic: string | null;
  content_focus: string | null;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok && response.status !== 503) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export const healthApi = {
  getRootInfo: (): Promise<RootInfo> => fetchJson<RootInfo>('/'),
  getLiveHealth: (): Promise<LiveHealth> => fetchJson<LiveHealth>('/api/v1/health/live'),
  getReadyHealth: (): Promise<ReadyHealth> => fetchJson<ReadyHealth>('/api/v1/health/ready'),
  getDependencies: (): Promise<DependenciesHealth> => fetchJson<DependenciesHealth>('/api/v1/health/dependencies'),
};

export const profileApi = {
  getProfile: (): Promise<CreatorProfile> => fetchJson<CreatorProfile>('/api/v1/profile'),
  listSchedules: (): Promise<WeeklyTopicSchedule[]> => fetchJson<WeeklyTopicSchedule[]>('/api/v1/profile/schedules'),
};
