-- Migration: create BI reporting tables
-- Adds: report_templates, scheduled_reports, report_executions, spiritual_insights, report_shares

-- Ensure pgcrypto/gen_random_uuid available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Report templates define reusable dashboard / report definitions (JSON payload for builder)
CREATE TABLE IF NOT EXISTS report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  template JSONB NOT NULL, -- layout, widgets, queries, filters
  template_type TEXT NOT NULL DEFAULT 'dashboard' CHECK (template_type IN ('dashboard','chart','table','mixed')),
  default_format TEXT NOT NULL DEFAULT 'pdf' CHECK (default_format IN ('pdf','csv','json')),
  is_public BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_templates_owner_id ON report_templates(owner_id);

-- Scheduled reports persist cron/schedule info for periodic runs
CREATE TABLE IF NOT EXISTS scheduled_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES report_templates(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  cron_expression TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  next_run TIMESTAMP WITH TIME ZONE,
  recipients JSONB DEFAULT '[]'::JSONB, -- array of emails or user ids
  output_format TEXT NOT NULL DEFAULT 'pdf' CHECK (output_format IN ('pdf','csv','json')),
  active BOOLEAN DEFAULT true,
  last_run TIMESTAMP WITH TIME ZONE,
  retry_policy JSONB DEFAULT '{}'::JSONB,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scheduled_reports_template_id ON scheduled_reports(template_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_reports_created_by ON scheduled_reports(created_by);

-- Executions store runtime metadata and result pointers for each report run
CREATE TABLE IF NOT EXISTS report_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_id UUID REFERENCES scheduled_reports(id) ON DELETE SET NULL,
  template_id UUID REFERENCES report_templates(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','completed','failed')),
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE,
  result_url TEXT, -- URL to generated artifact (PDF/CSV)
  result_data JSONB, -- structured results for quick UI preview
  logs TEXT,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_executions_template_id ON report_executions(template_id);
CREATE INDEX IF NOT EXISTS idx_report_executions_scheduled_id ON report_executions(scheduled_id);
CREATE INDEX IF NOT EXISTS idx_report_executions_status ON report_executions(status);

-- Spiritual / AI insights generated for users or community-level
CREATE TABLE IF NOT EXISTS spiritual_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL DEFAULT 'behavior' CHECK (insight_type IN ('behavior','community','predictive','custom')),
  score NUMERIC,
  content JSONB NOT NULL, -- structured insight payload (messages, sources, meta)
  source TEXT, -- e.g., 'heuristic', 'ai', 'manual'
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spiritual_insights_user_id ON spiritual_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_spiritual_insights_type ON spiritual_insights(insight_type);

-- Shares provide ephemeral public links or access metadata for executions
CREATE TABLE IF NOT EXISTS report_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID REFERENCES report_executions(id) ON DELETE CASCADE,
  shared_with JSONB DEFAULT '[]'::JSONB, -- list of emails or user ids
  access_token TEXT,
  link TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_shares_execution_id ON report_shares(execution_id);

-- Helpful small helper view: recent_report_executions for admin overview
CREATE OR REPLACE VIEW recent_report_executions AS
SELECT e.id, e.template_id, e.scheduled_id, e.status, e.started_at, e.finished_at, e.result_url, e.created_at
FROM report_executions e
ORDER BY e.created_at DESC
LIMIT 100;
