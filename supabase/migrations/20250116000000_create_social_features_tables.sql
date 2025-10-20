-- Migration: create social features tables
-- Tables: user_followers, groups, group_members, group_activity

-- user_followers: stores follower -> followed relationships
CREATE TABLE IF NOT EXISTS user_followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL,
  followed_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'active', -- active, blocked
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE (follower_id, followed_id)
);

CREATE INDEX IF NOT EXISTS idx_user_followers_follower ON user_followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_followers_followed ON user_followers(followed_id);

-- groups
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text,
  description text,
  avatar_url text,
  group_type text NOT NULL DEFAULT 'public', -- public/private/secret
  created_by uuid NOT NULL,
  member_count integer NOT NULL DEFAULT 0,
  max_members integer,
  tags text[] DEFAULT '{}',
  settings jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_groups_name ON groups(name);
CREATE INDEX IF NOT EXISTS idx_groups_tags ON groups USING GIN (tags);

-- group_members
CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member', -- owner, moderator, member
  status text NOT NULL DEFAULT 'active', -- active, pending, banned
  joined_at timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);

-- group_activity for events inside groups
CREATE TABLE IF NOT EXISTS group_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  activity_type text NOT NULL,
  activity_data jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_group_activity_group ON group_activity(group_id);
CREATE INDEX IF NOT EXISTS idx_group_activity_user ON group_activity(user_id);

-- lightweight community_activity additions: ensure activity has visibility
ALTER TABLE IF EXISTS community_activity ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'public';
CREATE INDEX IF NOT EXISTS idx_community_activity_visibility ON community_activity(visibility);

-- helper functions: follower counts & simple checks
CREATE OR REPLACE FUNCTION get_follower_count(uid uuid) RETURNS integer AS $$
  SELECT COUNT(*) FROM user_followers WHERE followed_id = uid AND status = 'active';
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION get_following_count(uid uuid) RETURNS integer AS $$
  SELECT COUNT(*) FROM user_followers WHERE follower_id = uid AND status = 'active';
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION is_following(a uuid, b uuid) RETURNS boolean AS $$
  SELECT EXISTS(SELECT 1 FROM user_followers WHERE follower_id = a AND followed_id = b AND status = 'active');
$$ LANGUAGE SQL STABLE;

-- helper: can_user_manage_group(group_id, user_id)
CREATE OR REPLACE FUNCTION can_user_manage_group(gid uuid, uid uuid) RETURNS boolean AS $$
  SELECT EXISTS(SELECT 1 FROM group_members WHERE group_id = gid AND user_id = uid AND role IN ('owner','moderator') AND status = 'active');
$$ LANGUAGE SQL STABLE;

-- triggers: auto-add creator as owner in group_members
CREATE OR REPLACE FUNCTION groups_after_insert_trigger() RETURNS trigger AS $$
BEGIN
  INSERT INTO group_members (group_id, user_id, role, status) VALUES (NEW.id, NEW.created_by, 'owner', 'active') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_groups_after_insert ON groups;
CREATE TRIGGER tr_groups_after_insert AFTER INSERT ON groups FOR EACH ROW EXECUTE PROCEDURE groups_after_insert_trigger();

CREATE OR REPLACE FUNCTION group_members_after_change_trigger() RETURNS trigger AS $$
BEGIN
  UPDATE groups SET member_count = (SELECT COUNT(*) FROM group_members WHERE group_id = NEW.group_id AND status = 'active') WHERE id = NEW.group_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_group_members_after_change ON group_members;
CREATE TRIGGER tr_group_members_after_change AFTER INSERT OR DELETE OR UPDATE ON group_members FOR EACH ROW EXECUTE PROCEDURE group_members_after_change_trigger();

-- trigger: log when user joins/leaves
CREATE OR REPLACE FUNCTION log_group_membership_activity() RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO group_activity (group_id, user_id, activity_type, activity_data) VALUES (NEW.group_id, NEW.user_id, 'member_joined', json_build_object('status', NEW.status));
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO group_activity (group_id, user_id, activity_type, activity_data) VALUES (OLD.group_id, OLD.user_id, 'member_left', json_build_object('status', OLD.status));
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO group_activity (group_id, user_id, activity_type, activity_data) VALUES (NEW.group_id, NEW.user_id, 'member_updated', json_build_object('old_status', OLD.status, 'new_status', NEW.status, 'old_role', OLD.role, 'new_role', NEW.role));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_log_group_membership_activity ON group_members;
CREATE TRIGGER tr_log_group_membership_activity AFTER INSERT OR DELETE OR UPDATE ON group_members FOR EACH ROW EXECUTE PROCEDURE log_group_membership_activity();

-- enable RLS on new tables if using Supabase/Postgres with RLS enabled elsewhere (policies should be added by DB admin as appropriate)
ALTER TABLE user_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_activity ENABLE ROW LEVEL SECURITY;

COMMIT;
-- Migration: Create social features tables (user_followers, groups, group_members, group_activity)
-- generated by assistant

-- Enable uuid-ossp or pgcrypto assumed available for gen_random_uuid

CREATE TABLE IF NOT EXISTS user_followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL,
  followed_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT user_follow_unique UNIQUE (follower_id, followed_id),
  CONSTRAINT no_self_follow CHECK (follower_id <> followed_id)
);

CREATE INDEX IF NOT EXISTS idx_user_followers_follower ON user_followers (follower_id);
CREATE INDEX IF NOT EXISTS idx_user_followers_followed ON user_followers (followed_id);
CREATE INDEX IF NOT EXISTS idx_user_followers_status ON user_followers (status);

CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  avatar_url text,
  group_type text NOT NULL DEFAULT 'public' CHECK (group_type IN ('public','private','secret')),
  created_by uuid,
  member_count integer NOT NULL DEFAULT 0,
  max_members integer,
  tags text[] DEFAULT '{}',
  settings jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_groups_created_by ON groups (created_by);
CREATE INDEX IF NOT EXISTS idx_groups_group_type ON groups (group_type);
CREATE INDEX IF NOT EXISTS idx_groups_tags_gin ON groups USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_groups_text_search ON groups USING GIN (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,'')));

CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner','moderator','member')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','pending','banned')),
  joined_at timestamptz NOT NULL DEFAULT NOW(),
  invited_by uuid,
  CONSTRAINT group_member_unique UNIQUE (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members (group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members (user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_role ON group_members (role);
CREATE INDEX IF NOT EXISTS idx_group_members_status ON group_members (status);

CREATE TABLE IF NOT EXISTS group_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL,
  user_id uuid,
  activity_type text NOT NULL,
  activity_data jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_group_activity_group ON group_activity (group_id);
CREATE INDEX IF NOT EXISTS idx_group_activity_user ON group_activity (user_id);
CREATE INDEX IF NOT EXISTS idx_group_activity_type ON group_activity (activity_type);
CREATE INDEX IF NOT EXISTS idx_group_activity_created_at ON group_activity (created_at);

-- Enable RLS (policies to be added by DB admins as needed)
ALTER TABLE user_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_activity ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION get_follower_count(uid uuid) RETURNS integer LANGUAGE sql AS $$
  SELECT COUNT(*) FROM user_followers WHERE followed_id = uid AND status = 'active';
$$;

CREATE OR REPLACE FUNCTION get_following_count(uid uuid) RETURNS integer LANGUAGE sql AS $$
  SELECT COUNT(*) FROM user_followers WHERE follower_id = uid AND status = 'active';
$$;

CREATE OR REPLACE FUNCTION is_following(follower uuid, followed uuid) RETURNS boolean LANGUAGE sql AS $$
  SELECT EXISTS(SELECT 1 FROM user_followers WHERE follower_id = $1 AND followed_id = $2 AND status = 'active');
$$;

CREATE OR REPLACE FUNCTION get_group_member_count(gid uuid) RETURNS integer LANGUAGE sql AS $$
  SELECT COUNT(*) FROM group_members WHERE group_id = gid AND status = 'active';
$$;

CREATE OR REPLACE FUNCTION is_group_member(gid uuid, uid uuid) RETURNS boolean LANGUAGE sql AS $$
  SELECT EXISTS(SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2 AND status = 'active');
$$;

CREATE OR REPLACE FUNCTION get_user_role_in_group(gid uuid, uid uuid) RETURNS text LANGUAGE sql AS $$
  SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2 AND status = 'active' LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION can_user_manage_group(gid uuid, uid uuid) RETURNS boolean LANGUAGE sql AS $$
  SELECT EXISTS(SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2 AND role IN ('owner','moderator') AND status = 'active');
$$;

-- Triggers: update updated_at column on groups
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Trigger to auto-add creator as owner
CREATE OR REPLACE FUNCTION trg_add_group_creator_as_owner() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO group_members (group_id, user_id, role, status) VALUES (NEW.id, NEW.created_by, 'owner', 'active') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_groups_after_insert AFTER INSERT ON groups FOR EACH ROW EXECUTE PROCEDURE trg_add_group_creator_as_owner();

-- Trigger to update member_count
-- NOTE: member_count updates are handled by `tr_group_members_after_change` above which recalculates counts.

-- Trigger to log group member activity
CREATE OR REPLACE FUNCTION trg_log_group_activity() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO group_activity (group_id, user_id, activity_type, activity_data) VALUES (NEW.group_id, NEW.user_id, 'member_joined', jsonb_build_object('role', NEW.role));
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO group_activity (group_id, user_id, activity_type, activity_data) VALUES (OLD.group_id, OLD.user_id, 'member_left', jsonb_build_object('role', OLD.role));
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_group_members_activity AFTER INSERT OR DELETE ON group_members FOR EACH ROW EXECUTE PROCEDURE trg_log_group_activity();

-- Add index to community_activity.user_id if needed
ALTER TABLE IF EXISTS community_activity ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'public';
CREATE INDEX IF NOT EXISTS idx_community_activity_user ON community_activity (user_id);
