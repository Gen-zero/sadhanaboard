-- Migration: Add enrichment columns to admin_logs and create security_events and log_alert_rules
BEGIN;

ALTER TABLE IF EXISTS admin_logs
  ADD COLUMN IF NOT EXISTS severity TEXT DEFAULT 'info',
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS ip_address INET,
  ADD COLUMN IF NOT EXISTS user_agent TEXT,
  ADD COLUMN IF NOT EXISTS session_id TEXT,
  ADD COLUMN IF NOT EXISTS correlation_id UUID,
  ADD COLUMN IF NOT EXISTS risk_score INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS geo_location JSONB,
  ADD COLUMN IF NOT EXISTS metadata JSONB;

CREATE TABLE IF NOT EXISTS security_events (
  id BIGSERIAL PRIMARY KEY,
  log_id BIGINT REFERENCES admin_logs(id) ON DELETE SET NULL,
  event_type TEXT,
  threat_level TEXT,
  detection_rule TEXT,
  correlation_id UUID,
  notes TEXT,
  false_positive BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by BIGINT
);

CREATE TABLE IF NOT EXISTS log_alert_rules (
  id BIGSERIAL PRIMARY KEY,
  rule_name TEXT NOT NULL,
  conditions JSONB DEFAULT '{}',
  notification_channels JSONB DEFAULT '[]',
  enabled BOOLEAN DEFAULT TRUE,
  severity_threshold TEXT DEFAULT 'warn',
  created_by BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_correlation ON admin_logs(correlation_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_severity ON admin_logs(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_log_id ON security_events(log_id);

COMMIT;
