// Test script to check what database URL is being used
require('dotenv').config({ path: '.env.development' });

console.log('Environment DATABASE_URL:', process.env.DATABASE_URL);

const db = require('./config/db');
console.log('Database module loaded');

// Let's try to access the pool configuration indirectly
// We'll create a simple query to see what connection string is being used
const { Pool } = require('pg');

// Create a temporary pool with the same config to inspect it
const tempPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  max: 10,
  application_name: 'saadhanaboard_backend'
});

console.log('Temp pool config:');
console.log('Connection string:', tempPool.options.connectionString);

// Clean up
tempPool.end();