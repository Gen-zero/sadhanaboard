-- Migration: add storage columns to spiritual_books table
-- Run this on your Postgres database as part of migrations or manually:

BEGIN;

-- Add file metadata columns to spiritual_books if missing
ALTER TABLE spiritual_books
  ADD COLUMN IF NOT EXISTS file_size bigint,
  ADD COLUMN IF NOT EXISTS storage_provider text,
  ADD COLUMN IF NOT EXISTS storage_path text,
  ADD COLUMN IF NOT EXISTS storage_url text,
  ADD COLUMN IF NOT EXISTS is_storage_file boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS optimized boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS optimized_path text,
  ADD COLUMN IF NOT EXISTS thumbnail_path text;

COMMIT;