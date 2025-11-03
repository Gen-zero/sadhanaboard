const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get DATABASE_URL from environment
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('ERROR: DATABASE_URL is not set in environment variables');
  console.error('Please check your .env file and ensure DATABASE_URL is properly configured');
  console.error('Refer to SUPABASE_DATABASE_CONFIGURATION.md for instructions');
  process.exit(1);
}

// Check if DATABASE_URL is properly configured
if (dbUrl.includes('YOUR_')) {
  console.error('ERROR: DATABASE_URL contains placeholder values');
  console.error('Please update your .env file with valid Supabase credentials');
  console.error('Refer to SUPABASE_DATABASE_CONFIGURATION.md for instructions');
  process.exit(1);
}

// Create a PostgreSQL connection pool using Supabase DATABASE_URL
// The connectionString includes ssl parameters, Pool handles it automatically
const pool = new Pool({
  connectionString: dbUrl,
  connectionTimeoutMillis: 30000,  // Increased timeout to 30 seconds
  idleTimeoutMillis: 30000,
  max: 10,
  application_name: 'saadhanaboard_backend'
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  console.error('This may indicate a network connectivity issue or invalid credentials');
});

console.log('Using Supabase PostgreSQL database');

// Query function for executing SQL queries
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 50) + '...', duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
}

// Connection test function for health checks
async function getConnectionTestResult() {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    return { success: true, method: 'postgres-pool' };
  } catch (error) {
    console.error('Connection test error:', error.message);
    return { success: false, error: error.message, method: 'postgres-pool' };
  }
}

// Pool information functions
function totalCount() {
  return pool.totalCount;
}

function idleCount() {
  return pool.idleCount;
}

function waitingCount() {
  return pool.waitingCount;
}

// Connect function (returns a client from the pool)
async function connect() {
  return await pool.connect();
}

module.exports = {
  query,
  connect,
  totalCount,
  idleCount,
  waitingCount,
  getConnectionTestResult,
  pool // Export the pool for direct access if needed
};