require('dotenv').config();
const { Pool } = require('pg');

// Test with the exact connection string from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const db = require('./config/db');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await db.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
}

testConnection();