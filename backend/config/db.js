const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Check if we're using Supabase
const useSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

let pool, supabase;

if (useSupabase) {
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
  
  // Create a pool for direct PostgreSQL connections to Supabase
  const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || 
    `${process.env.SUPABASE_URL}/postgres`.replace('https://', 'postgresql://postgres:');
  
  console.log('Connection string:', connectionString);
  
  pool = new Pool({
    connectionString,
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false
  });
} else {
  // Traditional PostgreSQL configuration
  console.log('Using traditional PostgreSQL database');
  const connectionString = process.env.DATABASE_URL || null;
  
  pool = new Pool(
    connectionString ? { 
      connectionString, 
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false 
    } : {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'saadhanaboard',
      password: process.env.DB_PASSWORD || 'root',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    }
  );
}

// Best-effort connection test (non-blocking)
pool.query('SELECT NOW()').then(() => {
  console.log('Database connected');
}).catch((err) => {
  console.warn('Database connection test failed (this may be expected in some dev environments):', err.message);
});

module.exports = {
  pool,
  supabase, // Export Supabase client for direct use when needed
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
  totalCount: () => (pool.totalCount !== undefined ? pool.totalCount : null),
  idleCount: () => (pool.idleCount !== undefined ? pool.idleCount : null),
  waitingCount: () => (pool.waitingCount !== undefined ? pool.waitingCount : null),
};