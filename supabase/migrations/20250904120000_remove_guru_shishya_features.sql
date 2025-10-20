-- Remove guru/shishya features migration
-- This migration removes all tables, functions, and policies related to the guru/shishya system

-- Drop policies first
DROP POLICY IF EXISTS "Users can view their mentorship relationships" ON public.mentorship_relationships;
DROP POLICY IF EXISTS "Shishyas can create mentorship requests" ON public.mentorship_relationships;
DROP POLICY IF EXISTS "Gurus can update mentorship relationships" ON public.mentorship_relationships;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their received messages" ON public.messages;

-- Drop indexes
DROP INDEX IF EXISTS idx_mentorship_guru_id;
DROP INDEX IF EXISTS idx_mentorship_shishya_id;
DROP INDEX IF EXISTS idx_mentorship_status;
DROP INDEX IF EXISTS idx_messages_sender_id;
DROP INDEX IF EXISTS idx_messages_recipient_id;
DROP INDEX IF EXISTS unique_active_shishya;

-- Drop tables
DROP TABLE IF EXISTS public.messages;
DROP TABLE IF EXISTS public.mentorship_relationships;
DROP TABLE IF EXISTS public.user_roles;

-- Drop functions
DROP FUNCTION IF EXISTS public.has_role(UUID, app_role);
DROP FUNCTION IF EXISTS public.get_user_role(UUID);

-- Drop enum type
DROP TYPE IF EXISTS public.app_role;

-- Update sadhanas table to remove assigned_by column and related policies
ALTER TABLE IF EXISTS public.sadhanas DROP COLUMN IF EXISTS assigned_by;

-- Update RLS policies for sadhanas to remove guru-specific logic
DROP POLICY IF EXISTS "Users can view their own sadhanas" ON public.sadhanas;
DROP POLICY IF EXISTS "Users can create their own sadhanas" ON public.sadhanas;
DROP POLICY IF EXISTS "Users can update their own sadhanas" ON public.sadhanas;
DROP POLICY IF EXISTS "Users can delete their own sadhanas" ON public.sadhanas;

-- Create simplified sadhana policies
CREATE POLICY "Users can manage their own sadhanas" 
  ON public.sadhanas FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Update sadhana_progress policies to remove guru access
DROP POLICY IF EXISTS "Users can view their own progress" ON public.sadhana_progress;
DROP POLICY IF EXISTS "Users can manage their own progress" ON public.sadhana_progress;

CREATE POLICY "Users can manage their own progress" 
  ON public.sadhana_progress FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Remove guru-related fields from profiles table
ALTER TABLE IF EXISTS public.profiles DROP COLUMN IF EXISTS available_for_guidance;
ALTER TABLE IF EXISTS public.profiles DROP COLUMN IF EXISTS experience_level;

-- Update profiles policies (keep existing ones as they don't reference roles)
-- No changes needed for profiles policies as they're user-based, not role-based

-- Remove any remaining indexes related to assigned_by
DROP INDEX IF EXISTS idx_sadhanas_assigned_by;