export interface AdminLog {
  id: number;
  admin_id: number | null;
  action: string | null;
  target_type?: string | null;
  target_id?: number | null;
  details?: any;
  severity?: string;
  category?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  session_id?: string | null;
  correlation_id?: string | null;
  risk_score?: number | null;
  geo_location?: any;
  metadata?: any;
  created_at?: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  limit?: number;
  offset?: number;
}

export interface SecurityEvent {
  id: number;
  log_id?: number | null;
  event_type?: string;
  threat_level?: string;
  detection_rule?: string;
  correlation_id?: string | null;
  notes?: string | null;
  false_positive?: boolean;
  created_at?: string;
  resolved_at?: string | null;
}

export interface AlertRule {
  id?: number;
  rule_name: string;
  conditions: any;
  notification_channels: any[];
  enabled?: boolean;
  severity_threshold?: string;
}
