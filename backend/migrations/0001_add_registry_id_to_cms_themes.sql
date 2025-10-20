-- Migration: add registry_id column to cms_themes (string) and index
-- Run this on your Postgres database as part of migrations or manually:

BEGIN;

ALTER TABLE IF EXISTS cms_themes
  ADD COLUMN IF NOT EXISTS registry_id VARCHAR;

CREATE INDEX IF NOT EXISTS idx_cms_themes_registry_id ON cms_themes(registry_id);

COMMIT;
