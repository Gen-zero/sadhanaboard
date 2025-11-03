require('dotenv').config({ path: '.env.development' });
const { Pool } = require('pg');

console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Check if DATABASE_URL is properly configured
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('YOUR_')) {
  console.error('\n❌ DATABASE_URL is not properly configured!');
  console.error('Please update your .env.development file with valid Supabase credentials.');
  console.error('Refer to SUPABASE_DATABASE_CONFIGURATION.md for instructions.\n');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000
});

const timeout = setTimeout(() => {
  console.error('Connection timed out after 10 seconds');
  process.exit(1);
}, 10000);

pool.query('SELECT NOW()', (err, res) => {
  clearTimeout(timeout);
  if (err) {
    console.error('Connection ERROR:', err.message);
    console.error('Error code:', err.code);
    console.error('\n❌ Database connection failed!');
    console.error('Please check your Supabase configuration.');
    console.error('Refer to SUPABASE_DATABASE_CONFIGURATION.md for troubleshooting.\n');
  } else {
    console.log('Connection SUCCESS:', res.rows[0]);
    console.log('\n✅ Database connection successful!\n');
  }
  pool.end(() => process.exit(0));
});