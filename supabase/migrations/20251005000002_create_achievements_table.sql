-- Create achievements table for tracking user accomplishments
BEGIN;

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  points INTEGER DEFAULT 0,
  earned BOOLEAN DEFAULT false,
  earned_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_earned ON achievements(earned);
CREATE INDEX IF NOT EXISTS idx_achievements_earned_at ON achievements(earned_at DESC);

-- Add some default achievements
INSERT INTO achievements (user_id, name, description, category, points, earned, metadata) 
SELECT 
  id as user_id,
  'First Steps' as name,
  'Completed your first sadhana' as description,
  'beginner' as category,
  10 as points,
  false as earned,
  '{"icon": "Leaf"}'::jsonb as metadata
FROM users
ON CONFLICT DO NOTHING;

INSERT INTO achievements (user_id, name, description, category, points, earned, metadata) 
SELECT 
  id as user_id,
  'Consistency Master' as name,
  '7-day streak achieved' as description,
  'streak' as category,
  50 as points,
  false as earned,
  '{"icon": "Flame"}'::jsonb as metadata
FROM users
ON CONFLICT DO NOTHING;

INSERT INTO achievements (user_id, name, description, category, points, earned, metadata) 
SELECT 
  id as user_id,
  'Mindful Warrior' as name,
  'Completed 50 sadhanas' as description,
  'completion' as category,
  100 as points,
  false as earned,
  '{"icon": "Medal"}'::jsonb as metadata
FROM users
ON CONFLICT DO NOTHING;

COMMIT;