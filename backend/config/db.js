const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Parse DATABASE_URL if it contains ssl parameters
const dbUrl = process.env.DATABASE_URL;
let sslConfig = false;

if (dbUrl && dbUrl.includes('sslmode=require')) {
  sslConfig = { rejectUnauthorized: false };
}

// Create a PostgreSQL connection pool using Supabase DATABASE_URL
const pool = new Pool({
  connectionString: dbUrl ? dbUrl.replace('?sslmode=require', '') : undefined,
  ssl: sslConfig,
  connectionTimeoutMillis: 30000,  // Increased timeout to 30 seconds
  idleTimeoutMillis: 30000,
  max: 10,
  application_name: 'saadhanaboard_backend'
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
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