-- Fix default values for spiritual feature fields in profiles table
BEGIN;

-- Set proper default values for chakra_balance and energy_balance columns
ALTER TABLE profiles ALTER COLUMN chakra_balance SET DEFAULT '{"root": 50, "sacral": 50, "solar": 50, "heart": 50, "throat": 50, "thirdEye": 50, "crown": 50}'::jsonb;
ALTER TABLE profiles ALTER COLUMN energy_balance SET DEFAULT '{"sattva": 33, "rajas": 33, "tamas": 34}'::jsonb;

-- Update existing records with proper default values
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