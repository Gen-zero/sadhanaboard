-- Create sadhana_progress table for tracking user sadhana completion
BEGIN;

-- Create sadhana_progress table
CREATE TABLE IF NOT EXISTS sadhana_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sadhana_id UUID NOT NULL REFERENCES sadhanas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  progress_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  duration_minutes INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique constraint on sadhana_id and progress_date
  UNIQUE(sadhana_id, progress_date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sadhana_progress_user_id ON sadhana_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_sadhana_progress_sadhana_id ON sadhana_progress(sadhana_id);
CREATE INDEX IF NOT EXISTS idx_sadhana_progress_date ON sadhana_progress(progress_date);
CREATE INDEX IF NOT EXISTS idx_sadhana_progress_completed ON sadhana_progress(completed);

COMMIT;