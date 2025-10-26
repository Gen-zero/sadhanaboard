const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create a Supabase client for database operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false
    }
  }
);

// Mock query function that uses Supabase client
async function query(sql, params = []) {
  console.warn('Direct SQL query attempted, but using Supabase client instead:', sql);
  
  // This is a simplified mock - in a real implementation, you would need to 
  // convert SQL queries to Supabase operations
  throw new Error('Direct SQL queries not supported with Supabase client. Use the supabase client directly.');
}

module.exports = {
  supabase,
  query,
  // Mock pool functions for compatibility
  connect: () => Promise.reject(new Error('Direct pool connections not supported with Supabase client')),
  totalCount: () => null,
  idleCount: () => null,
  waitingCount: () => null,
};