-- ============================================================================
-- SaadhanaBoard Row Level Security (RLS) Policies for Supabase
-- ============================================================================
-- This file contains Row Level Security policies for tables that should be
-- integrated with Supabase Auth. Execute this AFTER creating the schema if
-- you're using Supabase's authentication system.
--
-- Note: Some tables (like admin_details, report_templates) don't need RLS
-- as they're managed server-side or by admins only.
--
-- ============================================================================

-- ============================================================================
-- USERS TABLE
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view their own user record
CREATE POLICY "Users can view own user record"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own user record
CREATE POLICY "Users can update own user record"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- New users can insert their own record during registration
CREATE POLICY "Users can insert own user record"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles are viewable by everyone
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- SPIRITUAL BOOKS TABLE
-- ============================================================================

ALTER TABLE spiritual_books ENABLE ROW LEVEL SECURITY;

-- Users can view their own books
CREATE POLICY "Users can view own books"
  ON spiritual_books FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own books
CREATE POLICY "Users can insert own books"
  ON spiritual_books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own books
CREATE POLICY "Users can update own books"
  ON spiritual_books FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own books
CREATE POLICY "Users can delete own books"
  ON spiritual_books FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- BOOK PROGRESS TABLE
-- ============================================================================

ALTER TABLE book_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view own book progress"
  ON book_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own book progress"
  ON book_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own book progress"
  ON book_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- BOOK BOOKMARKS TABLE
-- ============================================================================

ALTER TABLE book_bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON book_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view public bookmarks
CREATE POLICY "Users can view public bookmarks"
  ON book_bookmarks FOR SELECT
  USING (is_public = true);

-- Users can insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON book_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookmarks
CREATE POLICY "Users can update own bookmarks"
  ON book_bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON book_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- BOOK ANNOTATIONS TABLE
-- ============================================================================

ALTER TABLE book_annotations ENABLE ROW LEVEL SECURITY;

-- Users can view their own annotations
CREATE POLICY "Users can view own annotations"
  ON book_annotations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view public annotations
CREATE POLICY "Users can view public annotations"
  ON book_annotations FOR SELECT
  USING (is_private = false);

-- Users can insert their own annotations
CREATE POLICY "Users can insert own annotations"
  ON book_annotations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own annotations
CREATE POLICY "Users can update own annotations"
  ON book_annotations FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own annotations
CREATE POLICY "Users can delete own annotations"
  ON book_annotations FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- SADHANAS TABLE
-- ============================================================================

ALTER TABLE sadhanas ENABLE ROW LEVEL SECURITY;

-- Users can view their own sadhanas
CREATE POLICY "Users can view own sadhanas"
  ON sadhanas FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = assigned_by);

-- Users can insert their own sadhanas
CREATE POLICY "Users can insert own sadhanas"
  ON sadhanas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own sadhanas
CREATE POLICY "Users can update own sadhanas"
  ON sadhanas FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = assigned_by);

-- Users can delete their own sadhanas
CREATE POLICY "Users can delete own sadhanas"
  ON sadhanas FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- SADHANA PROGRESS TABLE
-- ============================================================================

ALTER TABLE sadhana_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own sadhana progress
CREATE POLICY "Users can view own sadhana progress"
  ON sadhana_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own sadhana progress
CREATE POLICY "Users can insert own sadhana progress"
  ON sadhana_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own sadhana progress
CREATE POLICY "Users can update own sadhana progress"
  ON sadhana_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- SHARED SADHANAS TABLE
-- ============================================================================

ALTER TABLE shared_sadhanas ENABLE ROW LEVEL SECURITY;

-- Public sadhanas are viewable by everyone
CREATE POLICY "Public sadhanas are viewable by everyone"
  ON shared_sadhanas FOR SELECT
  USING (privacy_level = 'public');

-- Users can view their own shared sadhanas
CREATE POLICY "Users can view own shared sadhanas"
  ON shared_sadhanas FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own shared sadhanas
CREATE POLICY "Users can insert own shared sadhanas"
  ON shared_sadhanas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own shared sadhanas
CREATE POLICY "Users can update own shared sadhanas"
  ON shared_sadhanas FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own shared sadhanas
CREATE POLICY "Users can delete own shared sadhanas"
  ON shared_sadhanas FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- SADHANA LIKES TABLE
-- ============================================================================

ALTER TABLE sadhana_likes ENABLE ROW LEVEL SECURITY;

-- Everyone can view likes on public sadhanas
CREATE POLICY "Everyone can view likes"
  ON sadhana_likes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM shared_sadhanas 
      WHERE id = sadhana_id AND privacy_level = 'public'
    )
  );

-- Users can insert their own likes
CREATE POLICY "Users can insert own likes"
  ON sadhana_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can delete own likes"
  ON sadhana_likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- SADHANA COMMENTS TABLE
-- ============================================================================

ALTER TABLE sadhana_comments ENABLE ROW LEVEL SECURITY;

-- Everyone can view comments on public sadhanas
CREATE POLICY "Everyone can view comments on public sadhanas"
  ON sadhana_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM shared_sadhanas 
      WHERE id = sadhana_id AND privacy_level = 'public'
    )
  );

-- Users can insert comments on public sadhanas
CREATE POLICY "Users can insert comments"
  ON sadhana_comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM shared_sadhanas 
      WHERE id = sadhana_id AND privacy_level = 'public'
    )
  );

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON sadhana_comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON sadhana_comments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- GROUPS TABLE
-- ============================================================================

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- Public and private groups are viewable by everyone (details visible)
-- Secret groups only visible to members
CREATE POLICY "Groups visible based on type"
  ON groups FOR SELECT
  USING (
    group_type IN ('public', 'private') OR
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = id AND user_id = auth.uid() AND status = 'active'
    )
  );

-- Users can create groups
CREATE POLICY "Users can create groups"
  ON groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update groups they own or moderate
CREATE POLICY "Users can update groups they manage"
  ON groups FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = id AND user_id = auth.uid() AND role IN ('owner', 'moderator')
    )
  );

-- Only group owners can delete
CREATE POLICY "Only owners can delete groups"
  ON groups FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = id AND user_id = auth.uid() AND role = 'owner'
    )
  );

-- ============================================================================
-- GROUP MEMBERS TABLE
-- ============================================================================

ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Members can view group membership
CREATE POLICY "Members can view group members"
  ON group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm2
      WHERE gm2.group_id = group_id AND gm2.user_id = auth.uid() AND gm2.status = 'active'
    ) OR
    EXISTS (
      SELECT 1 FROM groups g
      WHERE g.id = group_id AND g.group_type IN ('public', 'private')
    )
  );

-- Users can join public groups
CREATE POLICY "Users can join groups"
  ON group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Members can update their own membership status (for moderators/owners)
CREATE POLICY "Managers can update member roles"
  ON group_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm2
      WHERE gm2.group_id = group_id AND gm2.user_id = auth.uid() AND gm2.role IN ('owner', 'moderator')
    )
  );

-- Users can remove themselves from groups
CREATE POLICY "Users can leave groups"
  ON group_members FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- GROUP ACTIVITY TABLE
-- ============================================================================

ALTER TABLE group_activity ENABLE ROW LEVEL SECURITY;

-- Group members can view activity in their groups
CREATE POLICY "Group members can view activity"
  ON group_activity FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = group_id AND user_id = auth.uid() AND status = 'active'
    )
  );

-- Users can log their own activity
CREATE POLICY "Users can log activity"
  ON group_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- USER FOLLOWERS TABLE
-- ============================================================================

ALTER TABLE user_followers ENABLE ROW LEVEL SECURITY;

-- Everyone can view active follow relationships
CREATE POLICY "Everyone can view followers"
  ON user_followers FOR SELECT
  USING (status = 'active');

-- Users can follow others
CREATE POLICY "Users can follow users"
  ON user_followers FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Users can unfollow
CREATE POLICY "Users can unfollow users"
  ON user_followers FOR DELETE
  USING (auth.uid() = follower_id);

-- ============================================================================
-- COMMUNITY ACTIVITY TABLE
-- ============================================================================

ALTER TABLE community_activity ENABLE ROW LEVEL SECURITY;

-- Users can view community activity
CREATE POLICY "Everyone can view community activity"
  ON community_activity FOR SELECT
  USING (true);

-- Users can log their own activity
CREATE POLICY "Users can log community activity"
  ON community_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- CMS TABLES
-- ============================================================================

-- CMS tables are typically managed by admins only via server-side code
-- RLS can be added here if needed, but usually these are accessed via API

ALTER TABLE cms_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_asset_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_version_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_audit_trail ENABLE ROW LEVEL SECURITY;

-- Allow public access to published CMS content (optional)
CREATE POLICY "Everyone can view published themes"
  ON cms_themes FOR SELECT
  USING (status = 'published');

CREATE POLICY "Everyone can view published templates"
  ON cms_templates FOR SELECT
  USING (status = 'published');

-- Admin policies would be enforced via API middleware

-- ============================================================================
-- ADMIN TABLES
-- ============================================================================

-- Admin tables should NOT have RLS enabled - they're accessed via API with
-- JWT validation and middleware checks instead

-- Note: admin_details, admin_integrations, report_* tables are NOT exposed
-- directly to clients - all access is through authenticated API endpoints
-- with proper authorization checks in middleware/services

-- ============================================================================
-- END OF RLS POLICIES
-- ============================================================================
-- These policies work with Supabase's authentication system (auth.uid()).
-- For tables that don't have auth integration, authorization is handled
-- in the API layer through middleware and service functions.
--
-- Make sure to:
-- 1. Enable Supabase Auth in your project
-- 2. Apply these policies after the schema is created
-- 3. Adjust policies as needed for your specific use case
-- ============================================================================
