export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type MetricTimeframe = '1h' | '6h' | '24h' | '7d' | '30d';
export type SystemAlertType = 'cpu' | 'memory' | 'disk' | 'database' | 'api';

export interface SystemMetrics {
  id?: string;
  timestamp?: string;
  created_at?: string;
  cpu_usage_percent?: number;
  memory_usage_percent?: number;
  disk_usage_percent?: number | null;
  load_average?: { one: number; five: number; fifteen: number } | any;
  active_connections?: number | null;
  idle_connections?: number | null;
  total_connections?: number | null;
  uptime_seconds?: number;
  extra?: {
    cpu_count?: number;
  };
}

export interface ApiMetricsOverview {
  total_requests?: number;
  avg_response_time?: number;
  error_count?: number;
  error_rate?: number;
}

export interface ApiMetricsEndpoint {
  endpoint: string;
  method: string;
  requests_count?: number;
  avg_response_time?: number;
  error_count?: number;
  error_rate?: number;
}

export interface ApiMetricsTrend {
  time_bucket?: string;
  requests_count?: number;
  avg_response_time?: number;
  error_count?: number;
}

export interface ApiMetrics {
  overview?: ApiMetricsOverview;
  endpoints?: ApiMetricsEndpoint[];
  trends?: ApiMetricsTrend[];
}

export interface DatabaseMetrics {
  connection_pool_status?: any;
  active_queries?: any[];
  slow_queries?: any[];
  table_sizes?: any[];
  index_usage?: any[];
}

export interface SystemAlert {
  id: string;
  alert_type: SystemAlertType;
  severity: AlertSeverity;
  message: string;
  metric_data?: any;
  resolved?: boolean;
  resolved_at?: string;
  resolved_by?: string;
  rule_id?: string;
  escalated?: boolean;
  escalated_at?: string;
  created_at?: string;
}

export interface SystemAlertRule {
  id: string;
  name: string;
  alert_type: SystemAlertType;
  conditions: any;
  thresholds: any;
  enabled: boolean;
  suppression_window: number;
  created_at?: string;
  updated_at?: string;
}

export interface DeploymentInfo {
  version?: string;
  git_commit?: string;
  build_date?: string;
  deployed_at?: string;
  deployment_status?: string;
  metadata?: any;
}

export interface SystemHealth {
  status: 'ok' | 'error';
  timestamp: string;
  database?: string;
  metrics?: SystemMetrics;
  environment?: {
    node_version: string;
    platform: string;
    arch: string;
  };
  error?: string;
}