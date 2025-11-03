#!/usr/bin/env node

/**
 * Test IPv6 Direct Connection
 */

require('dotenv').config({ path: '.env.development' });
const { Pool } = require('pg');

async function testIPv6Direct() {
  console.log('🔍 Testing IPv6 Direct Connection\n');
  
  // Use the resolved IPv6 address directly
  const ipv6 = '2406:da1c:f42:ae09:1bf2:22bd:e968:b671';
  const connectionString = `postgresql://postgres:KaliVaibhav@[${ipv6}]:6543/postgres?sslmode=require`;
  
  console.log('Connection string (IPv6 direct):');
  console.log(connectionString);
  console.log('\n🔌 Testing connection...\n');
  
  const pool = new Pool({
    connectionString: connectionString,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000,
    max: 1
  });
  
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    
    console.log('✅ Connection successful!');
    console.log(`Current server time: ${result.rows[0].now}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testIPv6Direct().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
