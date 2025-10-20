-- Add spiritual feature fields to profiles table
BEGIN;

-- Add karma balance field
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS karma_balance INTEGER DEFAULT 0;

-- Add spiritual points field
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS spiritual_points INTEGER DEFAULT 0;

-- Add level field
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

-- Add daily streak field
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_streak INTEGER DEFAULT 0;

-- Add sankalpa progress field
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sankalpa_progress NUMERIC(5,2) DEFAULT 0.00;

-- Add chakra balance field (JSONB for flexibility)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS chakra_balance JSONB DEFAULT '{"root": 50, "sacral": 50, "solar": 50, "heart": 50, "throat": 50, "thirdEye": 50, "crown": 50}'::jsonb;

-- Add energy balance field (JSONB for sattva-rajas-tamas)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS energy_balance JSONB DEFAULT '{"sattva": 33, "rajas": 33, "tamas": 34}'::jsonb;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_karma_balance ON profiles(karma_balance);
CREATE INDEX IF NOT EXISTS idx_profiles_spiritual_points ON profiles(spiritual_points);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON profiles(level);
CREATE INDEX IF NOT EXISTS idx_profiles_daily_streak ON profiles(daily_streak);

-- Add default values for existing users
UPDATE profiles 
SET 
  karma_balance = COALESCE(karma_balance, 100),
  spiritual_points = COALESCE(spiritual_points, 50),
  level = COALESCE(level, 1),
  daily_streak = COALESCE(daily_streak, 0),
  sankalpa_progress = COALESCE(sankalpa_progress, 0.00),
  chakra_balance = COALESCE(chakra_balance, '{"root": 50, "sacral": 50, "solar": 50, "heart": 50, "throat": 50, "thirdEye": 50, "crown": 50}'::jsonb),
  energy_balance = COALESCE(energy_balance, '{"sattva": 33, "rajas": 33, "tamas": 34}'::jsonb)
WHERE karma_balance IS NULL OR spiritual_points IS NULL OR level IS NULL OR daily_streak IS NULL OR sankalpa_progress IS NULL OR chakra_balance IS NULL OR energy_balance IS NULL;

COMMIT;