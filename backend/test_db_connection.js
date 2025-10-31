// Test database connection script
require('dotenv').config({ path: __dirname + '/.env' });
const db = require('./config/db');

async function testConnection() {
  console.log('Testing database connection with production config...');
  
  // Show what we're connecting with
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
  console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);
  
  try {
    console.log('Attempting to connect to database...');
    const result = await db.query('SELECT NOW() as now');
    console.log('✅ Database connection successful!');
    console.log('Current time from database:', result.rows[0].now);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error detail:', error.detail);
  }
  
  // Also test the pool status
  try {
    console.log('Pool status - Total:', db.totalCount(), 'Idle:', db.idleCount(), 'Waiting:', db.waitingCount());
  } catch (e) {
    console.log('Could not get pool status:', e.message);
  }
}

testConnection().then(() => {
  console.log('Test completed');
  process.exit(0);
}).catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
});