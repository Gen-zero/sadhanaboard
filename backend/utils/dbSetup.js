const { Client } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  // Use environment variables for connection
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 5432,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL with environment variables');
    
    // Check if database exists
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'saadhanaboard']
    );
    
    if (res.rowCount === 0) {
      // Database doesn't exist, create it
      await client.query(`CREATE DATABASE "${process.env.DB_NAME || 'saadhanaboard'}"`);
      console.log(`Database "${process.env.DB_NAME || 'saadhanaboard'}" created successfully`);
    } else {
      console.log(`Database "${process.env.DB_NAME || 'saadhanaboard'}" already exists`);
    }
    
    await client.end();
    return true;
  } catch (err) {
    console.log('Failed to connect to PostgreSQL:', err.message);
    return false;
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };