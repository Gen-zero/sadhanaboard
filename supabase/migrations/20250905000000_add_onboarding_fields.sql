-- Add onboarding fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS time_of_birth TIME;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS place_of_birth TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS favorite_deity TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Create index for onboarding_completed for efficient queries
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed ON public.profiles(onboarding_completed);

-- Update the profiles table policy to allow users to update onboarding fields
-- No need to change existing policies as they already allow users to update their own profiles