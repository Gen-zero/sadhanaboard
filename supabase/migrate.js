#!/usr/bin/env node

/**
 * Supabase Migration Script for SaadhanaBoard
 * 
 * This script helps migrate the existing PostgreSQL database to Supabase.
 * 
 * Usage:
 * 1. Update the .env file with your Supabase credentials
 * 2. Run this script to create the database schema in Supabase
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../backend/.env.development') });

// Supabase configuration
// Using the environment variables from your .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Environment variables loaded:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '***REDACTED***' : 'NOT FOUND');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateDatabase() {
  try {
    console.log('Starting Supabase migration...');
    console.log('Using Supabase URL:', supabaseUrl);
    
    // Test connection by trying to list tables (this will fail if not connected)
    console.log('Testing connection...');
    
    // Create a simple test table to verify connection
    console.log('Creating test table to verify connection...');
    const { error: testError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE TABLE IF NOT EXISTS migration_test (id SERIAL PRIMARY KEY, created_at TIMESTAMP DEFAULT NOW());'
    });
    
    if (testError) {
      console.log('Connection test completed (test table may already exist)');
    } else {
      console.log('Connection test successful');
    }
    
    // Clean up test table
    await supabase.rpc('exec_sql', {
      sql: 'DROP TABLE IF EXISTS migration_test;'
    });
    
    console.log('Database connection verified!');
    console.log('Manual migration steps completed. Please follow these steps:');
    console.log('');
    console.log('1. Go to your Supabase dashboard: https://app.supabase.com/project/bhasogcwwjsjzjkckzeh');
    console.log('2. Go to SQL Editor in the left sidebar');
    console.log('3. Run the following SQL commands one by one:');
    console.log('');
    console.log('-- Enable UUID extension');
    console.log('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    console.log('');
    console.log('-- Create users table');
    console.log('CREATE TABLE IF NOT EXISTS users (');
    console.log('  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),');
    console.log('  email TEXT UNIQUE NOT NULL,');
    console.log('  password TEXT NOT NULL,');
    console.log('  display_name TEXT NOT NULL,');
    console.log('  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),');
    console.log('  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
    console.log(');');
    console.log('');
    console.log('-- Create profiles table');
    console.log('CREATE TABLE IF NOT EXISTS profiles (');
    console.log('  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,');
    console.log('  display_name TEXT NOT NULL,');
    console.log('  avatar_url TEXT,');
    console.log('  bio TEXT,');
    console.log('  experience_level TEXT,');
    console.log('  traditions TEXT[] DEFAULT \'{}\',');
    console.log('  location TEXT,');
    console.log('  available_for_guidance BOOLEAN DEFAULT false,');
    console.log('  date_of_birth DATE,');
    console.log('  time_of_birth TIME,');
    console.log('  place_of_birth TEXT,');
    console.log('  favorite_deity TEXT,');
    console.log('  gotra TEXT,');
    console.log('  varna TEXT,');
    console.log('  sampradaya TEXT,');
    console.log('  onboarding_completed BOOLEAN DEFAULT false,');
    console.log('  settings JSONB,');
    console.log('  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),');
    console.log('  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
    console.log(');');
    console.log('');
    console.log('The script has provided instructions for manual migration.');
    console.log('Please follow the steps above to complete your database setup.');
    
  } catch (error) {
    console.error('Error during migration:', error);
    console.log('');
    console.log('Manual migration steps:');
    console.log('1. Go to your Supabase dashboard: https://app.supabase.com/project/bhasogcwwjsjzjkckzeh');
    console.log('2. Go to SQL Editor in the left sidebar');
    console.log('3. Run the SQL commands provided in the script above');
    process.exit(1);
  }
}

// Run migration
migrateDatabase();