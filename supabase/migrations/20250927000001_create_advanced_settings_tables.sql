-- Migration: create advanced settings tables for feature flags, experiments, notifications, integrations, security policies, and reminders
-- Generated: 2025-09-27

CREATE TABLE IF NOT EXISTS admin_feature_flags (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT FALSE,
  conditions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON admin_feature_flags(key);

CREATE TABLE IF NOT EXISTS admin_ab_experiments (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  description TEXT,
  variants JSONB NOT NULL,-- { "A":0.5, "B":0.5 }
  traffic_allocation JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_experiments_key ON admin_ab_experiments(key);

CREATE TABLE IF NOT EXISTS admin_notification_channels (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,-- email|sms|push|webhook
  config JSONB DEFAULT '{}'::jsonb,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_integrations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  credentials JSONB DEFAULT '{}'::jsonb,
  enabled BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_security_policies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  rules JSONB DEFAULT '[]'::jsonb,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_reminder_templates (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  title TEXT,
  body TEXT,
  schedule_cron TEXT, -- cron expression or ISO interval
  channel_ids INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  enabled BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- updated_at trigger helper
CREATE OR REPLACE FUNCTION admin_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to relevant tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'feature_flags_set_updated_at') THEN
    CREATE TRIGGER feature_flags_set_updated_at BEFORE UPDATE ON admin_feature_flags FOR EACH ROW EXECUTE PROCEDURE admin_set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'ab_experiments_set_updated_at') THEN
    CREATE TRIGGER ab_experiments_set_updated_at BEFORE UPDATE ON admin_ab_experiments FOR EACH ROW EXECUTE PROCEDURE admin_set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'notification_channels_set_updated_at') THEN
    CREATE TRIGGER notification_channels_set_updated_at BEFORE UPDATE ON admin_notification_channels FOR EACH ROW EXECUTE PROCEDURE admin_set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'integrations_set_updated_at') THEN
    CREATE TRIGGER integrations_set_updated_at BEFORE UPDATE ON admin_integrations FOR EACH ROW EXECUTE PROCEDURE admin_set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'security_policies_set_updated_at') THEN
    CREATE TRIGGER security_policies_set_updated_at BEFORE UPDATE ON admin_security_policies FOR EACH ROW EXECUTE PROCEDURE admin_set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'reminder_templates_set_updated_at') THEN
    CREATE TRIGGER reminder_templates_set_updated_at BEFORE UPDATE ON admin_reminder_templates FOR EACH ROW EXECUTE PROCEDURE admin_set_updated_at();
  END IF;
END$$;
