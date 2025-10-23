const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Check if we're using Supabase (only if all required env vars are present)
const useSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

let pool, supabase;

if (useSupabase) {
  try {
    // Supabase configuration
    console.log('Using Supabase database');
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false
        }
      }
    );
    
    // Try to create a pool for direct PostgreSQL connections to Supabase
    const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;
    
    if (connectionString) {
      console.log('Setting up direct PostgreSQL connection to Supabase (may timeout in some environments)');
      console.log('Connection string (first 50 chars):', connectionString.substring(0, 50) + '...');
      
      // Very conservative connection settings for Supabase with fallback
      pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000, // 5 second connection timeout
        idleTimeoutMillis: 10000, // 10 seconds idle timeout
        max: 2, // Minimal pool size
        query_timeout: 10000 // 10 second query timeout
      });
    } else {
      // Fallback to a minimal configuration
      console.log('No DATABASE_URL provided, using minimal configuration');
      pool = new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      });
    }
  } catch (error) {
    console.error('Failed to initialize Supabase connection:', error.message);
    // Create a very basic fallback pool
    pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: 'postgres',
      port: 5432,
    });
  }
} else {
  // Traditional PostgreSQL configuration as fallback
  console.log('Using traditional PostgreSQL database configuration');
  const connectionString = process.env.DATABASE_URL || null;
  
  // If DATABASE_URL is provided, use it directly
  if (connectionString) {
    pool = new Pool({
      connectionString,
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      max: 10
    });
  } else {
    // Use individual environment variables
    pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'saadhanaboard',
      password: process.env.DB_PASSWORD || 'root',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      max: 10
    });
  }
}

// Connection test that doesn't block startup but gives more information
async function testConnection() {
  try {
    // Quick test with timeout
    const result = await Promise.race([
      pool.query('SELECT 1'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection test timeout after 3 seconds')), 3000)
      )
    ]);
    console.log('✅ Database connection test passed');
    return true;
  } catch (err) {
    console.warn('⚠️  Database connection test failed (this may be expected in some environments):', err.message);
    console.warn('The application will continue to run but some database features may be limited.');
    console.warn('You can still use the Supabase JS client for most operations.');
    return true;
  }
}

// Run non-blocking connection test
setImmediate(() => {
  testConnection().catch(() => {
    // Ignore errors in the test
  });
});

// Enhanced query function with graceful degradation
async function enhancedQuery(text, params) {
  try {
    // Try the direct PostgreSQL connection first
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    // Log the error with more details
    console.error('Database query error:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      query: text.substring(0, 100) + (text.length > 100 ? '...' : '')
    });
    
    // If it's a connection error, provide a more helpful message
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      console.log('⚠️  Direct PostgreSQL connection failed, but Supabase JS client may still work');
      console.log('⚠️  Some features that require direct database access may be limited');
    }
    
    throw error;
  }
}

module.exports = {
  pool,
  supabase, // Export Supabase client for direct use when needed
  query: enhancedQuery,
  connect: () => {
    try {
      return pool.connect();
    } catch (error) {
      console.error('Database connection error:', error.message);
      throw error;
    }
  },
  totalCount: () => (pool.totalCount !== undefined ? pool.totalCount : null),
  idleCount: () => (pool.idleCount !== undefined ? pool.idleCount : null),
  waitingCount: () => (pool.waitingCount !== undefined ? pool.waitingCount : null),
  // Export the Supabase client directly for services that need it
  getSupabaseClient: () => supabase
};