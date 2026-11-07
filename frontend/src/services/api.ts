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

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok && response.status !== 503) {
    let detail = `Error ${response.status}: ${response.statusText}`;
    try {
      const body = await response.json();
      if (body.detail) detail = body.detail;
      else if (body.message) detail = body.message;
    } catch {
      // Keep default
    }
    throw new Error(detail);
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
  getProfile: (): Promise<CreatorProfile | null> => fetchJson<CreatorProfile | null>('/api/v1/profile'),
  updateProfile: (data: Partial<CreatorProfile>): Promise<CreatorProfile> =>
    fetchJson<CreatorProfile>('/api/v1/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  listSchedules: (): Promise<WeeklyTopicSchedule[]> => fetchJson<WeeklyTopicSchedule[]>('/api/v1/profile/schedules'),
  upsertSchedule: (data: { day_of_week: string; topic: string; subtopic?: string; content_focus?: string }): Promise<WeeklyTopicSchedule> =>
    fetchJson<WeeklyTopicSchedule>('/api/v1/profile/schedules', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteSchedule: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/profile/schedules/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok && res.status !== 204) {
      throw new Error(`Failed to delete topic schedule (${res.status})`);
    }
  },
};
