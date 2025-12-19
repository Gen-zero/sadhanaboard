-- Migration: Create custom_sadhanas table
-- Description: Create table for storing user-created custom sadhana templates

-- Create the custom_sadhanas table
CREATE TABLE IF NOT EXISTS custom_sadhanas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  purpose TEXT,
  goal TEXT,
  deity TEXT,
  message TEXT,
  offerings TEXT[],
  duration_days INTEGER DEFAULT 40,
  is_draft BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_custom_sadhanas_user_id ON custom_sadhanas(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_sadhanas_is_draft ON custom_sadhanas(is_draft);
CREATE INDEX IF NOT EXISTS idx_custom_sadhanas_created_at ON custom_sadhanas(created_at);