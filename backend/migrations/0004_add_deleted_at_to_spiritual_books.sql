-- Migration: add deleted_at column to spiritual_books table
-- Run this on your Postgres database as part of migrations or manually:

BEGIN;

-- Add soft delete support for spiritual_books
ALTER TABLE spiritual_books
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_spiritual_books_deleted_at ON spiritual_books(deleted_at);

COMMIT;