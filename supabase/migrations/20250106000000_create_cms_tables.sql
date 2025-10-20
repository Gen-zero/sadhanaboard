-- Migration: Create CMS tables
-- Created by automated scaffold

CREATE TABLE IF NOT EXISTS cms_content_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cms_assets (
  id BIGSERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  type TEXT,
  file_path TEXT,
  file_size BIGINT,
  mime_type TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  tags TEXT[],
  category_id BIGINT REFERENCES cms_content_categories(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft',
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_assets_type ON cms_assets(type);
CREATE INDEX IF NOT EXISTS idx_cms_assets_tags ON cms_assets USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_cms_assets_status_created ON cms_assets(status, created_at);

CREATE TABLE IF NOT EXISTS cms_asset_variants (
  id BIGSERIAL PRIMARY KEY,
  asset_id BIGINT REFERENCES cms_assets(id) ON DELETE CASCADE,
  variant_type TEXT,
  file_path TEXT,
  width INT,
  height INT,
  file_size BIGINT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cms_themes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  deity TEXT,
  description TEXT,
  color_palette JSONB DEFAULT '{}'::jsonb,
  css_variables JSONB DEFAULT '{}'::jsonb,
  preview_image TEXT,
  status TEXT DEFAULT 'draft',
  version INT DEFAULT 1,
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cms_templates (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT,
  difficulty_level TEXT,
  duration_minutes INT,
  instructions JSONB DEFAULT '[]'::jsonb,
  components JSONB DEFAULT '[]'::jsonb,
  tags TEXT[],
  category_id BIGINT REFERENCES cms_content_categories(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft',
  version INT DEFAULT 1,
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_templates_status_created ON cms_templates(status, created_at);

CREATE TABLE IF NOT EXISTS cms_version_history (
  id BIGSERIAL PRIMARY KEY,
  content_type TEXT NOT NULL,
  content_id BIGINT NOT NULL,
  version INT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Minimal audit table
CREATE TABLE IF NOT EXISTS cms_audit_trail (
  id BIGSERIAL PRIMARY KEY,
  admin_id INTEGER,
  action TEXT,
  content_type TEXT,
  content_id BIGINT,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to auto-update updated_at on update
CREATE OR REPLACE FUNCTION cms_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cms_assets_updated_at BEFORE UPDATE ON cms_assets FOR EACH ROW EXECUTE PROCEDURE cms_set_updated_at();
CREATE TRIGGER trg_cms_themes_updated_at BEFORE UPDATE ON cms_themes FOR EACH ROW EXECUTE PROCEDURE cms_set_updated_at();
CREATE TRIGGER trg_cms_templates_updated_at BEFORE UPDATE ON cms_templates FOR EACH ROW EXECUTE PROCEDURE cms_set_updated_at();
