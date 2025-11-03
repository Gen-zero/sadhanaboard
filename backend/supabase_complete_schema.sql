-- ============================================================================
-- SaadhanaBoard Complete Database Schema for Supabase
-- ============================================================================
-- This SQL file defines all tables, constraints, and indexes for the
-- SaadhanaBoard application. Execute this file directly in Supabase to
-- set up the complete database schema.
--
-- PostgreSQL version: 12.x+ (Supabase compatible)
-- Created: 2025-01-07
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE USERS & AUTHENTICATION
-- ============================================================================

-- Users table: Core user account information
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Profiles table: Extended user profile information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  experience_level TEXT,
  traditions TEXT[] DEFAULT '{}',
  location TEXT,
  available_for_guidance BOOLEAN DEFAULT false,
  date_of_birth DATE,
  time_of_birth TIME,
  place_of_birth TEXT,
  favorite_deity TEXT,
  gotra TEXT,
  varna TEXT,
  sampradaya TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);

-- Waitlist table: Join waiting list for application access
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);

-- ============================================================================
-- SPIRITUAL BOOKS
-- ============================================================================

-- Spiritual books table: Library of spiritual texts
CREATE TABLE IF NOT EXISTS spiritual_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  traditions TEXT[] DEFAULT '{}',
  content TEXT,
  storage_url TEXT,
  is_storage_file BOOLEAN DEFAULT false,
  description TEXT,
  year INTEGER,
  language TEXT DEFAULT 'english',
  page_count INTEGER,
  cover_url TEXT,
  file_size INTEGER,
  deleted_at TIMESTAMP WITH TIME ZONE,
  search_vector TSVECTOR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spiritual_books_user_id ON spiritual_books(user_id);
CREATE INDEX IF NOT EXISTS idx_spiritual_books_created_at ON spiritual_books(created_at);
CREATE INDEX IF NOT EXISTS idx_spiritual_books_deleted_at ON spiritual_books(deleted_at);
CREATE INDEX IF NOT EXISTS idx_spiritual_books_search_vector ON spiritual_books USING GIN(search_vector);

-- Book progress table: Track user's reading progress
CREATE TABLE IF NOT EXISTS book_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES spiritual_books(id) ON DELETE CASCADE NOT NULL,
  position JSONB,
  page INTEGER,
  percent NUMERIC,
  time_spent_minutes INTEGER DEFAULT 0,
  last_seen_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_book_progress_user_id ON book_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_book_progress_book_id ON book_progress(book_id);

-- Book bookmarks table: User bookmarks within books
CREATE TABLE IF NOT EXISTS book_bookmarks (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES spiritual_books(id) ON DELETE CASCADE NOT NULL,
  label TEXT,
  page INTEGER,
  position JSONB,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_book_bookmarks_user_id ON book_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_book_bookmarks_book_id ON book_bookmarks(book_id);

-- Book annotations table: User annotations and notes within books
CREATE TABLE IF NOT EXISTS book_annotations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES spiritual_books(id) ON DELETE CASCADE NOT NULL,
  page INTEGER,
  position JSONB,
  content TEXT,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_book_annotations_user_id ON book_annotations(user_id);
CREATE INDEX IF NOT EXISTS idx_book_annotations_book_id ON book_annotations(book_id);

-- ============================================================================
-- SADHANAS (SPIRITUAL PRACTICES)
-- ============================================================================

-- Sadhanas table: Spiritual practice routines
CREATE TABLE IF NOT EXISTS sadhanas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'daily' CHECK (category IN ('daily', 'goal')),
  due_date DATE,
  due_time TIME,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  tags TEXT[] DEFAULT '{}',
  reflection TEXT,
  sadhana_id INTEGER,
  deity TEXT,
  duration_minutes INTEGER DEFAULT 30,
  experience_points INTEGER DEFAULT 10,
  streak_count INTEGER DEFAULT 0,
  last_completed_at TIMESTAMP WITH TIME ZONE,
  spiritual_tags TEXT[] DEFAULT '{}',
  practice_type TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sadhanas_user_id ON sadhanas(user_id);
CREATE INDEX IF NOT EXISTS idx_sadhanas_assigned_by ON sadhanas(assigned_by);
CREATE INDEX IF NOT EXISTS idx_sadhanas_created_at ON sadhanas(created_at);

-- Sadhana progress table: Daily progress tracking for sadhanas
CREATE TABLE IF NOT EXISTS sadhana_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sadhana_id UUID REFERENCES sadhanas(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  progress_date DATE DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sadhana_id, progress_date)
);

CREATE INDEX IF NOT EXISTS idx_sadhana_progress_user_id ON sadhana_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_sadhana_progress_sadhana_id ON sadhana_progress(sadhana_id);

-- Shared sadhanas table: Sharing and community features
CREATE TABLE IF NOT EXISTS shared_sadhanas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sadhana_id UUID REFERENCES sadhanas(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  privacy_level TEXT DEFAULT 'public' CHECK (privacy_level IN ('public', 'friends', 'private')),
  share_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sadhana_id)
);

CREATE INDEX IF NOT EXISTS idx_shared_sadhanas_user_id ON shared_sadhanas(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_sadhanas_privacy_level ON shared_sadhanas(privacy_level);

-- Sadhana likes table: Community engagement - likes
CREATE TABLE IF NOT EXISTS sadhana_likes (
  id SERIAL PRIMARY KEY,
  sadhana_id UUID REFERENCES sadhanas(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sadhana_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_sadhana_likes_user_id ON sadhana_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_sadhana_likes_sadhana_id ON sadhana_likes(sadhana_id);

-- Sadhana comments table: Community engagement - comments
CREATE TABLE IF NOT EXISTS sadhana_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sadhana_id UUID REFERENCES sadhanas(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES sadhana_comments(id) ON DELETE CASCADE,
  is_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sadhana_comments_sadhana_id ON sadhana_comments(sadhana_id);
CREATE INDEX IF NOT EXISTS idx_sadhana_comments_user_id ON sadhana_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_sadhana_comments_parent_id ON sadhana_comments(parent_comment_id);

-- ============================================================================
-- GROUPS & COMMUNITY
-- ============================================================================

-- Groups table: Community groups for sadhana practice
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  group_type TEXT DEFAULT 'public' CHECK (group_type IN ('public', 'private', 'secret')),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  max_members INTEGER,
  settings JSONB DEFAULT '{}',
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_groups_created_by ON groups(created_by);
CREATE INDEX IF NOT EXISTS idx_groups_group_type ON groups(group_type);
CREATE INDEX IF NOT EXISTS idx_groups_created_at ON groups(created_at);

-- Group members table: Membership management
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'moderator', 'member')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'blocked')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_status ON group_members(status);

-- Group activity table: Activity tracking within groups
CREATE TABLE IF NOT EXISTS group_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_group_activity_group_id ON group_activity(group_id);
CREATE INDEX IF NOT EXISTS idx_group_activity_user_id ON group_activity(user_id);

-- ============================================================================
-- SOCIAL FEATURES
-- ============================================================================

-- User followers table: Following/follower relationships
CREATE TABLE IF NOT EXISTS user_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  followed_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, followed_id)
);

CREATE INDEX IF NOT EXISTS idx_user_followers_follower_id ON user_followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_followers_followed_id ON user_followers(followed_id);

-- Community activity table: General community activity feed
CREATE TABLE IF NOT EXISTS community_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_activity_user_id ON community_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_community_activity_type ON community_activity(activity_type);

-- ============================================================================
-- CMS (CONTENT MANAGEMENT SYSTEM)
-- ============================================================================

-- CMS assets table: Digital assets management
CREATE TABLE IF NOT EXISTS cms_assets (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT,
  file_path TEXT,
  file_size INTEGER,
  mime_type TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  tags TEXT[] DEFAULT '{}',
  category_id INTEGER,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_assets_created_by ON cms_assets(created_by);
CREATE INDEX IF NOT EXISTS idx_cms_assets_status ON cms_assets(status);

-- CMS asset variants table: Multiple versions/formats of assets
CREATE TABLE IF NOT EXISTS cms_asset_variants (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER REFERENCES cms_assets(id) ON DELETE CASCADE NOT NULL,
  variant_type TEXT,
  file_path TEXT,
  file_size INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_cms_asset_variants_asset_id ON cms_asset_variants(asset_id);

-- CMS themes table: UI theme definitions
CREATE TABLE IF NOT EXISTS cms_themes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  deity TEXT,
  description TEXT,
  color_palette JSONB DEFAULT '{}'::jsonb,
  css_variables JSONB DEFAULT '{}'::jsonb,
  preview_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  version INTEGER DEFAULT 1,
  registry_id VARCHAR,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_themes_status ON cms_themes(status);
CREATE INDEX IF NOT EXISTS idx_cms_themes_registry_id ON cms_themes(registry_id);

-- CMS templates table: Reusable content templates
CREATE TABLE IF NOT EXISTS cms_templates (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT,
  difficulty_level TEXT,
  duration_minutes INTEGER,
  instructions JSONB DEFAULT '[]'::jsonb,
  components JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  category_id INTEGER,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  version INTEGER DEFAULT 1,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_templates_status ON cms_templates(status);
CREATE INDEX IF NOT EXISTS idx_cms_templates_created_by ON cms_templates(created_by);

-- CMS version history table: Content versioning and audit trail
CREATE TABLE IF NOT EXISTS cms_version_history (
  id SERIAL PRIMARY KEY,
  content_type TEXT NOT NULL,
  content_id INTEGER NOT NULL,
  version INTEGER NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_version_history_content_type ON cms_version_history(content_type, content_id);

-- CMS audit trail table: Detailed audit logging
CREATE TABLE IF NOT EXISTS cms_audit_trail (
  id SERIAL PRIMARY KEY,
  admin_id UUID,
  action TEXT NOT NULL,
  content_type TEXT,
  content_id INTEGER,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_audit_trail_admin_id ON cms_audit_trail(admin_id);
CREATE INDEX IF NOT EXISTS idx_cms_audit_trail_created_at ON cms_audit_trail(created_at);

-- ============================================================================
-- ADMIN & SETTINGS
-- ============================================================================

-- Admin details table: Administrator accounts
CREATE TABLE IF NOT EXISTS admin_details (
  id SERIAL PRIMARY KEY,
  username VARCHAR(150) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin', 'moderator')),
  active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_by INTEGER REFERENCES admin_details(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_details_username ON admin_details(username);
CREATE INDEX IF NOT EXISTS idx_admin_details_email ON admin_details(email);
CREATE INDEX IF NOT EXISTS idx_admin_details_active ON admin_details(active);

-- Admin integrations table: Third-party service integrations
CREATE TABLE IF NOT EXISTS admin_integrations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  credentials JSONB DEFAULT '{}'::jsonb,
  enabled BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  spreadsheet_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_integrations_provider ON admin_integrations(provider);
CREATE INDEX IF NOT EXISTS idx_admin_integrations_enabled ON admin_integrations(enabled);

-- ============================================================================
-- BUSINESS INTELLIGENCE & REPORTING
-- ============================================================================

-- Report templates table: BI report templates
CREATE TABLE IF NOT EXISTS report_templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id INTEGER REFERENCES admin_details(id) ON DELETE SET NULL,
  template JSONB NOT NULL,
  template_type TEXT DEFAULT 'dashboard' CHECK (template_type IN ('dashboard', 'chart', 'table', 'mixed')),
  default_format TEXT DEFAULT 'pdf' CHECK (default_format IN ('pdf', 'csv', 'json')),
  is_public BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_templates_owner_id ON report_templates(owner_id);
CREATE INDEX IF NOT EXISTS idx_report_templates_is_public ON report_templates(is_public);

-- Scheduled reports table: Automated report execution schedules
CREATE TABLE IF NOT EXISTS scheduled_reports (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES report_templates(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  cron_expression TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  next_run TIMESTAMP WITH TIME ZONE,
  recipients JSONB DEFAULT '[]'::JSONB,
  output_format TEXT DEFAULT 'pdf' CHECK (output_format IN ('pdf', 'csv', 'json')),
  active BOOLEAN DEFAULT true,
  last_run TIMESTAMP WITH TIME ZONE,
  retry_policy JSONB DEFAULT '{}'::JSONB,
  created_by INTEGER REFERENCES admin_details(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scheduled_reports_template_id ON scheduled_reports(template_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_reports_created_by ON scheduled_reports(created_by);
CREATE INDEX IF NOT EXISTS idx_scheduled_reports_active ON scheduled_reports(active);

-- Report executions table: Individual report execution history
CREATE TABLE IF NOT EXISTS report_executions (
  id SERIAL PRIMARY KEY,
  scheduled_id INTEGER REFERENCES scheduled_reports(id) ON DELETE SET NULL,
  template_id INTEGER REFERENCES report_templates(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE,
  result_url TEXT,
  result_data JSONB,
  logs TEXT,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_executions_template_id ON report_executions(template_id);
CREATE INDEX IF NOT EXISTS idx_report_executions_scheduled_id ON report_executions(scheduled_id);
CREATE INDEX IF NOT EXISTS idx_report_executions_status ON report_executions(status);
CREATE INDEX IF NOT EXISTS idx_report_executions_created_at ON report_executions(created_at);

-- Spiritual insights table: AI-generated insights about spiritual progress
CREATE TABLE IF NOT EXISTS spiritual_insights (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sadhana_id UUID REFERENCES sadhanas(id) ON DELETE SET NULL,
  name TEXT,
  description TEXT,
  insight_type TEXT DEFAULT 'behavior' CHECK (insight_type IN ('behavior', 'community', 'predictive', 'custom')),
  score NUMERIC,
  content JSONB NOT NULL,
  source TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spiritual_insights_user_id ON spiritual_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_spiritual_insights_type ON spiritual_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_spiritual_insights_generated_at ON spiritual_insights(generated_at);

-- Report shares table: Sharing and access control for reports
CREATE TABLE IF NOT EXISTS report_shares (
  id SERIAL PRIMARY KEY,
  execution_id INTEGER REFERENCES report_executions(id) ON DELETE CASCADE,
  shared_with JSONB DEFAULT '[]'::JSONB,
  access_token TEXT,
  link TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by INTEGER REFERENCES admin_details(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_shares_execution_id ON report_shares(execution_id);
CREATE INDEX IF NOT EXISTS idx_report_shares_access_token ON report_shares(access_token);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Recent report executions view: Helpful for quick access to recent reports
CREATE OR REPLACE VIEW recent_report_executions AS
SELECT e.id, e.template_id, e.scheduled_id, e.status, e.started_at, 
       e.finished_at, e.result_url, e.created_at
FROM report_executions e
ORDER BY e.created_at DESC
LIMIT 100;

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to get follower count
CREATE OR REPLACE FUNCTION get_follower_count(user_id UUID)
RETURNS BIGINT AS $$
  SELECT COUNT(*) FROM user_followers WHERE followed_id = user_id AND status = 'active';
$$ LANGUAGE SQL STABLE;

-- Function to get following count
CREATE OR REPLACE FUNCTION get_following_count(user_id UUID)
RETURNS BIGINT AS $$
  SELECT COUNT(*) FROM user_followers WHERE follower_id = user_id AND status = 'active';
$$ LANGUAGE SQL STABLE;

-- Function to check if user follows another user
CREATE OR REPLACE FUNCTION is_following(follower_id UUID, followed_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(SELECT 1 FROM user_followers 
                WHERE follower_id = follower_id AND followed_id = followed_id AND status = 'active');
$$ LANGUAGE SQL STABLE;

-- Function to check if user can manage a group
CREATE OR REPLACE FUNCTION can_user_manage_group(group_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM group_members 
    WHERE group_id = group_id AND user_id = user_id AND role IN ('owner', 'moderator') AND status = 'active'
  );
$$ LANGUAGE SQL STABLE;

-- ============================================================================
-- COMMENTS
-- ============================================================================

-- Table structure comments for documentation
COMMENT ON TABLE users IS 'Core user accounts with authentication';
COMMENT ON TABLE profiles IS 'Extended user profile with spiritual information';
COMMENT ON TABLE spiritual_books IS 'Library of spiritual texts and knowledge';
COMMENT ON TABLE sadhanas IS 'Spiritual practice routines and exercises';
COMMENT ON TABLE sadhana_progress IS 'Daily tracking of sadhana completion';
COMMENT ON TABLE groups IS 'Community groups for group sadhana practice';
COMMENT ON TABLE group_members IS 'Group membership and roles';
COMMENT ON TABLE user_followers IS 'Social follow relationships between users';
COMMENT ON TABLE shared_sadhanas IS 'Sharing and community engagement for sadhanas';
COMMENT ON TABLE sadhana_comments IS 'Comments on shared sadhanas in community';
COMMENT ON TABLE cms_themes IS 'UI theme definitions for frontend customization';
COMMENT ON TABLE cms_templates IS 'Reusable content templates';
COMMENT ON TABLE cms_assets IS 'Digital assets (images, videos, etc.)';
COMMENT ON TABLE admin_details IS 'Administrator user accounts';
COMMENT ON TABLE admin_integrations IS 'Third-party service integrations';
COMMENT ON TABLE report_templates IS 'Templates for business intelligence reports';
COMMENT ON TABLE scheduled_reports IS 'Scheduled report generation';
COMMENT ON TABLE report_executions IS 'History of report execution';
COMMENT ON TABLE spiritual_insights IS 'AI-generated insights about user progress';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
-- All tables have been created with proper relationships, constraints,
-- and indexes for optimal performance.
-- 
-- To enable Row Level Security (RLS) for Supabase Auth integration,
-- see the accompanying RLS_POLICIES.sql file.
-- ============================================================================
