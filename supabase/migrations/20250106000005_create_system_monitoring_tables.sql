-- Create tables for system monitoring
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cpu_usage_percent NUMERIC,
  memory_usage_percent NUMERIC,
  disk_usage_percent NUMERIC,
  load_average JSONB,
  active_connections INTEGER,
  idle_connections INTEGER,
  total_connections INTEGER,
  uptime_seconds BIGINT,
  extra JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp DESC);

CREATE TABLE IF NOT EXISTS api_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  endpoint TEXT,
  method TEXT,
  status_code INTEGER,
  response_time_ms INTEGER,
  requests_count INTEGER DEFAULT 1,
  error_count INTEGER DEFAULT 0,
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_api_metrics_endpoint ON api_metrics(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_metrics_timestamp ON api_metrics(timestamp);

CREATE TABLE IF NOT EXISTS system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT,
  severity TEXT,
  message TEXT,
  metric_data JSONB,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT,
  rule_id UUID,
  escalated BOOLEAN NOT NULL DEFAULT false,
  escalated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_alerts_created_at ON system_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_alerts_resolved ON system_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_system_alerts_rule_id ON system_alerts(rule_id);

CREATE TABLE IF NOT EXISTS system_alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  alert_type TEXT,
  conditions JSONB,
  thresholds JSONB,
  enabled BOOLEAN DEFAULT true,
  suppression_window INTEGER DEFAULT 300, -- seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_alert_rules_enabled ON system_alert_rules(enabled);
CREATE INDEX IF NOT EXISTS idx_system_alert_rules_created_at ON system_alert_rules(created_at DESC);

CREATE TABLE IF NOT EXISTS deployment_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT,
  git_commit TEXT,
  build_date TIMESTAMP WITH TIME ZONE,
  deployed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deployment_status TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_deployment_info_created_at ON deployment_info(created_at DESC);