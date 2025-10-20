-- Enhance sadhanas table for better spiritual progress tracking
BEGIN;

-- Add deity field to track which deity this sadhana is for
ALTER TABLE sadhanas ADD COLUMN IF NOT EXISTS deity TEXT;

-- Add duration_minutes field to track how long the sadhana takes
ALTER TABLE sadhanas ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 30;

-- Add experience_points field to track how much spiritual experience this sadhana gives
ALTER TABLE sadhanas ADD COLUMN IF NOT EXISTS experience_points INTEGER DEFAULT 10;

-- Add streak_count field to track consecutive completions
ALTER TABLE sadhanas ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;

-- Add last_completed_at field to track when it was last completed
ALTER TABLE sadhanas ADD COLUMN IF NOT EXISTS last_completed_at TIMESTAMP WITH TIME ZONE;

-- Add tags for better categorization
ALTER TABLE sadhanas ADD COLUMN IF NOT EXISTS spiritual_tags TEXT[] DEFAULT '{}';

-- Add a field to track the type of sadhana (meditation, puja, japa, etc.)
ALTER TABLE sadhanas ADD COLUMN IF NOT EXISTS practice_type TEXT;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sadhanas_deity ON sadhanas(deity);
CREATE INDEX IF NOT EXISTS idx_sadhanas_practice_type ON sadhanas(practice_type);
CREATE INDEX IF NOT EXISTS idx_sadhanas_last_completed ON sadhanas(last_completed_at);
CREATE INDEX IF NOT EXISTS idx_sadhanas_streak ON sadhanas(streak_count);

-- Add default values for existing sadhanas
UPDATE sadhanas 
SET 
  duration_minutes = 30,
  experience_points = 10,
  practice_type = 'general'
WHERE duration_minutes IS NULL;

COMMIT;