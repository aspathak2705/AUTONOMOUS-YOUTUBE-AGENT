import { DependenciesHealth, LiveHealth, ReadyHealth, RootInfo } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
