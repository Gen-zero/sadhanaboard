# Supabase Database Configuration

This document explains how to properly configure the Supabase database connection for the SaadhanaBoard backend.

## Issue Summary

The database connection was failing with "ENOTFOUND" errors because:
1. The Supabase project references in the configuration files were outdated/incorrect
2. The hostname format was inconsistent with Supabase requirements

## Fixed Configuration

The configuration files have been updated with proper placeholder values:

### Environment Files Updated

1. **[.env](file:///d:/sadhanaboard/backend/.env)** - Production configuration
2. **[.env.development](file:///d:/sadhanaboard/backend/.env.development)** - Development configuration
3. **[.env.example](file:///d:/sadhanaboard/backend/.env.example)** - Example template

All files now use the correct format:
```
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:6543/postgres?sslmode=require
```

## How to Configure Your Supabase Database

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project reference (found in the project URL)
3. Set a strong database password

### Step 2: Update Environment Variables

Replace the placeholder values in your environment files:

1. `YOUR_DB_PASSWORD` - Your actual database password
2. `YOUR_PROJECT_REF` - Your actual Supabase project reference

Example with real values:
```
DATABASE_URL=postgresql://postgres:MySecurePassword123@db.abcd1234efgh5678.supabase.co:6543/postgres?sslmode=require
```

### Step 3: Apply Database Schema

Run the database schema setup:
```bash
cd backend
npm run migrate
```

### Step 4: Test Connection

Verify the connection works:
```bash
cd backend
node test-db-fix.js
```

## Configuration Details

### Required Format

The DATABASE_URL must follow this exact format:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?sslmode=require
```

Key points:
- Must include `db.` prefix before the project reference
- Use port `6543` for pooled connections (recommended)
- Include `?sslmode=require` parameter
- Never commit real credentials to version control

### Environment-Specific Settings

- **Development**: Use [.env.development](file:///d:/sadhanaboard/backend/.env.development)
- **Production**: Use [.env](file:///d:/sadhanaboard/backend/.env)
- **Examples**: Use [.env.example](file:///d:/sadhanaboard/backend/.env.example) as template

## Troubleshooting

### Common Errors

1. **ENOTFOUND**: Project doesn't exist or project reference is incorrect
2. **Authentication failed**: Password is incorrect
3. **Connection timeout**: Network/firewall issues

### Verification Steps

1. Check that your Supabase project exists and is active
2. Verify the project reference is correct
3. Confirm database password is correct
4. Ensure network connectivity to Supabase

## Security Notes

- Never commit real credentials to version control
- Use different passwords for development and production
- Rotate credentials regularly
- Restrict database access with RLS policies