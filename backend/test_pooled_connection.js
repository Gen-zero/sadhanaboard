require('dotenv').config({path: './.env'});
const { Client } = require('pg');

// Test the new pooled connection
const connectionString = process.env.DATABASE_URL;

console.log('Testing pooled connection with:', connectionString);

// Updated to use the pooled connection with proper timeout
const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000, // 10 second timeout
  idleTimeoutMillis: 30000,
  max: 1
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
    console.error('Error code:', err.code);
    console.error('Error details:', err);
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
    console.log('Note: Direct PostgreSQL connections may be blocked by firewall. Application will use Supabase client as fallback.');
  }
  process.exit(success ? 0 : 1);
});