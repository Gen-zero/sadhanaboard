const { Client } = require('pg');
require('dotenv').config({ path: __dirname + '/.env.development' });

// Test direct PostgreSQL connection
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Subham%409835@bhasogcwwjsjzjkckzeh.supabase.co:5432/postgres?sslmode=require';

console.log('Testing PostgreSQL connection...');
console.log('Connection string:', connectionString);

const client = new Client({
  connectionString,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function testConnection() {
  try {
    await client.connect();
    console.log('PostgreSQL connection successful!');
    
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    
    await client.end();
    return true;
  } catch (err) {
    console.error('PostgreSQL connection failed:', err.message);
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
    console.log('✅ PostgreSQL connection test passed');
  } else {
    console.log('❌ PostgreSQL connection test failed');
  }
  process.exit(success ? 0 : 1);
});