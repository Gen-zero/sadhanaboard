const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Check if required environment variables are set
if (!process.env.SUPABASE_URL) {
  console.error('ERROR: SUPABASE_URL is not set in environment variables');
  console.error('Please check your .env file and ensure SUPABASE_URL is properly configured');
  console.error('Refer to SUPABASE_DATABASE_CONFIGURATION.md for instructions');
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_ANON_KEY) {
  console.error('ERROR: Neither SUPABASE_SERVICE_ROLE_KEY nor SUPABASE_ANON_KEY is set');
  console.error('Please check your .env file and ensure one of these keys is properly configured');
  console.error('Refer to SUPABASE_DATABASE_CONFIGURATION.md for instructions');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

console.log('Using Supabase client for database operations');

// Query function that uses Supabase PostgREST API
async function query(text, params) {
  try {
    // This is a workaround - we'll still use the pg library for direct queries
    // because Supabase client is primarily for API access
    // For now, we'll use PostgreSQL direct connection via DATABASE_URL
    const { Pool } = require('pg');
    
    // Check if DATABASE_URL is properly configured
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set in environment variables');
    }
    
    if (process.env.DATABASE_URL.includes('YOUR_')) {
      throw new Error('DATABASE_URL contains placeholder values');
    }
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Force IPv6 connection since Supabase resolves to IPv6
      family: 6
    });
    
    const client = await pool.connect();
    const result = await client.query(text, params);
    client.release();
    
    return result;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
}

// Connection test function
async function getConnectionTestResult() {
  try {
    const { data, error } = await supabase.from('users').select('COUNT(*)');
    
    if (error) {
      return { success: false, error: error.message, method: 'supabase-postgrest' };
    }
    
    return { success: true, method: 'supabase-postgrest' };
  } catch (error) {
    // Fallback to direct connection test
    try {
      // Check if DATABASE_URL is properly configured
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set in environment variables');
      }
      
      if (process.env.DATABASE_URL.includes('YOUR_')) {
        throw new Error('DATABASE_URL contains placeholder values');
      }
      
      const { Pool } = require('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        // Force IPv6 connection since Supabase resolves to IPv6
        family: 6
      });
      
      const client = await pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      await pool.end();
      
      return { success: true, method: 'postgres-direct' };
    } catch (err) {
      return { success: false, error: err.message, method: 'postgres-direct' };
    }
  }
}

module.exports = {
  supabase,
  query,
  getConnectionTestResult
};