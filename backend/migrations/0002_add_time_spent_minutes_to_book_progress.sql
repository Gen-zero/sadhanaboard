-- Migration: add time_spent_minutes column to book_progress table
-- Run this on your Postgres database as part of migrations or manually:

BEGIN;

ALTER TABLE IF EXISTS book_progress
  ADD COLUMN IF NOT EXISTS time_spent_minutes integer DEFAULT 0;

COMMIT;