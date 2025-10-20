- Migration: Create sadhana_activity and spiritual_milestones tables

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- sadhana_activity: stores user practice events used by BI
CREATE TABLE IF NOT EXISTS sadhana_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sadhana_id UUID REFERENCES sadhanas(id) ON DELETE SET NULL,
  practice_type TEXT,
  source TEXT,
  duration_minutes INTEGER,
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sadhana_activity_created_at ON sadhana_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sadhana_activity_user_id ON sadhana_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_sadhana_activity_practice_type ON sadhana_activity(practice_type);

-- spiritual_milestones: user achievements
CREATE TABLE IF NOT EXISTS spiritual_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sadhana_id UUID REFERENCES sadhanas(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  milestone_type TEXT,
  achieved BOOLEAN DEFAULT false,
  achieved_at TIMESTAMP WITH TIME ZONE,
  progress_value NUMERIC,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_spiritual_milestones_user_id ON spiritual_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_spiritual_milestones_updated_at ON spiritual_milestones(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_spiritual_milestones_type ON spiritual_milestones(milestone_type);
