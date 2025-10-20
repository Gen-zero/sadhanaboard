-- Migration: create community management tables
-- Adds posts, comments, reports, events, participants, mentorship programs, activity stream, milestones
BEGIN;

CREATE TABLE IF NOT EXISTS community_posts (
  id bigserial PRIMARY KEY,
  user_id int REFERENCES users(id) ON DELETE SET NULL,
  content text NOT NULL,
  post_type varchar(32) DEFAULT 'text',
  status varchar(32) DEFAULT 'draft',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_posts_user ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON community_posts(status);

CREATE TABLE IF NOT EXISTS community_comments (
  id bigserial PRIMARY KEY,
  post_id bigint REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id int REFERENCES users(id) ON DELETE SET NULL,
  content text NOT NULL,
  status varchar(32) DEFAULT 'visible',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_comments_post ON community_comments(post_id);

CREATE TABLE IF NOT EXISTS community_reports (
  id bigserial PRIMARY KEY,
  reporter_id int REFERENCES users(id) ON DELETE SET NULL,
  reported_content_type varchar(32) NOT NULL,
  reported_content_id bigint NOT NULL,
  reason text,
  status varchar(32) DEFAULT 'pending',
  admin_notes text,
  resolved_by int REFERENCES users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_reports_status ON community_reports(status);

CREATE TABLE IF NOT EXISTS community_events (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  description text,
  event_type varchar(64) DEFAULT 'meditation',
  start_time timestamptz,
  end_time timestamptz,
  location text,
  max_participants int DEFAULT 0,
  created_by int REFERENCES users(id) ON DELETE SET NULL,
  status varchar(32) DEFAULT 'draft',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_participants (
  id bigserial PRIMARY KEY,
  event_id bigint REFERENCES community_events(id) ON DELETE CASCADE,
  user_id int REFERENCES users(id) ON DELETE SET NULL,
  status varchar(32) DEFAULT 'registered',
  joined_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_participants_event ON event_participants(event_id);

CREATE TABLE IF NOT EXISTS mentorship_programs (
  id bigserial PRIMARY KEY,
  mentor_id int REFERENCES users(id) ON DELETE SET NULL,
  mentee_id int REFERENCES users(id) ON DELETE SET NULL,
  program_type varchar(64) DEFAULT 'general',
  status varchar(32) DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  metadata jsonb DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS community_activity (
  id bigserial PRIMARY KEY,
  user_id int REFERENCES users(id) ON DELETE SET NULL,
  activity_type varchar(64) NOT NULL,
  activity_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_activity_user ON community_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_community_activity_type ON community_activity(activity_type);

CREATE TABLE IF NOT EXISTS spiritual_milestones (
  id bigserial PRIMARY KEY,
  user_id int REFERENCES users(id) ON DELETE SET NULL,
  milestone_type varchar(64) NOT NULL,
  milestone_data jsonb DEFAULT '{}',
  achieved_at timestamptz DEFAULT now()
);

COMMIT;
