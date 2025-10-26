require('dotenv').config({path: './.env.development'});
const { Client } = require('pg');

// Test the new pooled connection
const connectionString = process.env.DATABASE_URL;

console.log('Testing pooled connection with:', connectionString);

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('Attempting to connect to database via pooler...');
    await client.connect();
    console.log('✅ Successfully connected to database via pooler!');
    
    const res = await client.query('SELECT NOW() as now');
    console.log('Query result:', res.rows[0]);
    
    await client.end();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    try {
      await client.end();
    } catch (endErr) {
      // Ignore errors when closing connection
    }
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('✅ Pooled connection test passed');
  } else {
    console.log('❌ Pooled connection test failed');
  }
  process.exit(success ? 0 : 1);
});