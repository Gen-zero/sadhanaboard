require('dotenv').config();
const { Pool } = require('pg');

console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

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
  } else {
    console.log('Connection SUCCESS:', res.rows[0]);
  }
  pool.end(() => process.exit(0));
});
