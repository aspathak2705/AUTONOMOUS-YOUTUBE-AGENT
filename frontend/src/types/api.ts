export interface RootInfo {
  name: string;
  status: string;
  version: string;
  environment: string;
}

export interface LiveHealth {
  status: string;
  timestamp: string;
}

export interface ReadinessChecks {
  configuration: string;
  database: string;
  openrouter: string;
  youtube: string;
}

export interface ReadyHealth {
  status: string;
  checks: ReadinessChecks;
}

export interface DependencyItem {
  configured: boolean;
  status: string;
  details?: string;
}

export interface DependenciesHealth {
  database: DependencyItem;
  openrouter: DependencyItem;
  youtube: DependencyItem;
}
