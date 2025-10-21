# Supabase Migration Guide

This directory contains the necessary files and instructions for migrating the SaadhanaBoard application to Supabase.

## Migration Steps

1. Create a Supabase project
2. Set up the database schema
3. Configure authentication
4. Update environment variables
5. Test the migration
6. Deploy to Netlify

## Database Schema Migration

The database schema has already been defined in the backend/utils/initDb.js file. This file contains all the necessary SQL statements to create the tables and indexes required by the application.

## Environment Variables

The following environment variables need to be configured in Supabase:

- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

These will be used by both the frontend and backend applications.