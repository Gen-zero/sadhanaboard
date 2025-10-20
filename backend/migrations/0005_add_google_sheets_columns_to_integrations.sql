-- Migration: Add Google Sheets specific columns to admin_integrations table
-- This migration ensures the admin_integrations table can store Google Sheets specific metadata

-- Add spreadsheet_id column to store the Google Spreadsheet ID
ALTER TABLE admin_integrations 
ADD COLUMN IF NOT EXISTS spreadsheet_id TEXT;

-- Add a comment to document the purpose of the new column
COMMENT ON COLUMN admin_integrations.spreadsheet_id IS 'Google Spreadsheet ID for Google Sheets integration';

-- Update the existing metadata column comment
COMMENT ON COLUMN admin_integrations.metadata IS 'JSONB metadata for the integration (provider-specific configuration)';

-- Create an index on the provider column for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_integrations_provider ON admin_integrations(provider);