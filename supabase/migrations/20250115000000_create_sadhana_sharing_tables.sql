-- Migration: create sadhana sharing tables
-- Adds shared_sadhanas, sadhana_likes, sadhana_comments

BEGIN;

-- shared_sadhanas
CREATE TABLE IF NOT EXISTS shared_sadhanas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sadhana_id uuid NOT NULL REFERENCES sadhanas(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  privacy_level text NOT NULL DEFAULT 'public',
  share_count integer NOT NULL DEFAULT 0,
  view_count integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  shared_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT shared_sadhana_unique UNIQUE (sadhana_id)
);
CREATE INDEX IF NOT EXISTS idx_shared_sadhanas_user_id ON shared_sadhanas(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_sadhanas_privacy_level ON shared_sadhanas(privacy_level);
CREATE INDEX IF NOT EXISTS idx_shared_sadhanas_shared_at ON shared_sadhanas(shared_at);

-- sadhana_likes
CREATE TABLE IF NOT EXISTS sadhana_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sadhana_id uuid NOT NULL REFERENCES sadhanas(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT sadhana_likes_unique UNIQUE (sadhana_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_sadhana_likes_sadhana_id ON sadhana_likes(sadhana_id);
CREATE INDEX IF NOT EXISTS idx_sadhana_likes_user_id ON sadhana_likes(user_id);

-- sadhana_comments
CREATE TABLE IF NOT EXISTS sadhana_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sadhana_id uuid NOT NULL REFERENCES sadhanas(id) ON DELETE CASCADE,
  user_id uuid,
  content text NOT NULL,
  parent_comment_id uuid REFERENCES sadhana_comments(id) ON DELETE CASCADE,
  is_edited boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sadhana_comments_sadhana_id ON sadhana_comments(sadhana_id);
CREATE INDEX IF NOT EXISTS idx_sadhana_comments_parent_comment_id ON sadhana_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_sadhana_comments_created_at ON sadhana_comments(created_at);

-- Enable RLS (left as placeholders; projects may adjust policies)
ALTER TABLE IF EXISTS shared_sadhanas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sadhana_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sadhana_comments ENABLE ROW LEVEL SECURITY;

-- Triggers helpers (simple updated_at)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_shared_sadhanas_updated_at
BEFORE UPDATE ON shared_sadhanas
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER trg_sadhana_comments_updated_at
BEFORE UPDATE ON sadhana_comments
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Trigger: when like inserted/removed, update share_count in shared_sadhanas if present
CREATE OR REPLACE FUNCTION trg_update_share_count_on_like()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE shared_sadhanas SET share_count = share_count + 1 WHERE sadhana_id = NEW.sadhana_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE shared_sadhanas SET share_count = GREATEST(0, share_count - 1) WHERE sadhana_id = OLD.sadhana_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sadhana_likes_after
AFTER INSERT OR DELETE ON sadhana_likes
FOR EACH ROW EXECUTE PROCEDURE trg_update_share_count_on_like();

COMMIT;
