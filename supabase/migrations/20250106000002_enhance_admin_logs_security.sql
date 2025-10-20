-- Enhance admin_logs for security monitoring and add related tables
-- Generated: 2025-09-27

-- Extend admin_logs with security-focused columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_logs' AND column_name='severity') THEN
    ALTER TABLE admin_logs ADD COLUMN severity VARCHAR(20) DEFAULT 'info';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_logs' AND column_name='category') THEN
    ALTER TABLE admin_logs ADD COLUMN category VARCHAR(50);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_logs' AND column_name='ip_address') THEN
    ALTER TABLE admin_logs ADD COLUMN ip_address INET;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_logs' AND column_name='user_agent') THEN
    ALTER TABLE admin_logs ADD COLUMN user_agent TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_logs' AND column_name='session_id') THEN
    ALTER TABLE admin_logs ADD COLUMN session_id VARCHAR(255);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_logs' AND column_name='correlation_id') THEN
    ALTER TABLE admin_logs ADD COLUMN correlation_id UUID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_logs' AND column_name='risk_score') THEN
    ALTER TABLE admin_logs ADD COLUMN risk_score INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_logs' AND column_name='geo_location') THEN
    ALTER TABLE admin_logs ADD COLUMN geo_location JSONB;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_logs' AND column_name='metadata') THEN
    ALTER TABLE admin_logs ADD COLUMN metadata JSONB;
  END IF;
END$$;

-- Create security_events table
CREATE TABLE IF NOT EXISTS security_events (
  id SERIAL PRIMARY KEY,
  log_id INTEGER REFERENCES admin_logs(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  threat_level VARCHAR(20) DEFAULT 'low',
  detection_rule TEXT,
  false_positive BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create alert rules table
CREATE TABLE IF NOT EXISTS log_alert_rules (
  id SERIAL PRIMARY KEY,
  rule_name TEXT NOT NULL,
  conditions JSONB NOT NULL,
  severity_threshold VARCHAR(20) DEFAULT 'warn',
  notification_channels JSONB DEFAULT '[]'::jsonb,
  enabled BOOLEAN DEFAULT TRUE,
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_severity ON admin_logs(severity);
CREATE INDEX IF NOT EXISTS idx_admin_logs_category ON admin_logs(category);
CREATE INDEX IF NOT EXISTS idx_admin_logs_ip ON admin_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);

-- retention/partitioning note: leave partitioning to DBAs; provide retention helper function
CREATE OR REPLACE FUNCTION admin_archive_old_logs(retention_days integer)
RETURNS void AS $$
BEGIN
  -- This function is a placeholder. Actual archiving should move old logs to archive storage/tables.
  DELETE FROM admin_logs WHERE created_at < NOW() - (retention_days || ' days')::interval;
END;
$$ LANGUAGE plpgsql;
