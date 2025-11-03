#!/usr/bin/env node

/**
 * Database Connection Diagnostic Tool
 * Tests Supabase connection and provides diagnostic information
 */

require('dotenv').config({ path: '.env.development' });
const { Pool } = require('pg');
const dns = require('dns').promises;

async function diagnoseConnection() {
  console.log('🔍 Database Connection Diagnostic Tool\n');
  console.log('=' .repeat(50));
  
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('❌ ERROR: DATABASE_URL not found in .env.development');
    process.exit(1);
  }
  
  console.log('✓ DATABASE_URL detected');
  
  // Parse connection string
  const urlObj = new URL(dbUrl);
  console.log(`\n📋 Connection Details:`);
  console.log(`   Host: ${urlObj.hostname}`);
  console.log(`   Port: ${urlObj.port || 5432}`);
  console.log(`   Database: ${urlObj.pathname.slice(1)}`);
  console.log(`   User: ${urlObj.username}`);
  console.log(`   SSL Mode: ${urlObj.searchParams.get('sslmode') || 'default'}`);
  
  // Test DNS resolution
  console.log(`\n🌐 DNS Resolution Test:`);
  try {
    const addresses = await dns.resolve4(urlObj.hostname);
    console.log(`   ✓ IPv4 addresses: ${addresses.join(', ')}`);
  } catch (err) {
    console.log(`   ✗ IPv4 resolution failed: ${err.message}`);
  }
  
  try {
    const addresses = await dns.resolve6(urlObj.hostname);
    console.log(`   ✓ IPv6 addresses: ${addresses.join(', ')}`);
  } catch (err) {
    console.log(`   ✗ IPv6 resolution failed: ${err.message}`);
  }
  
  // Test connection
  console.log(`\n🔌 Testing PostgreSQL Connection...`);
  
  const pool = new Pool({
    connectionString: dbUrl,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000,
    max: 1
  });
  
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    
    console.log('   ✓ Connection successful!');
    console.log(`   Current server time: ${result.rows[0].now}`);
    console.log('\n' + '=' .repeat(50));
    console.log('✅ Database is reachable and working!\n');
    process.exit(0);
  } catch (error) {
    console.error(`   ✗ Connection failed: ${error.message}`);
    console.log(`\n⚠️  Troubleshooting Tips:`);
    console.log('   1. Check your internet connection');
    console.log('   2. Verify DATABASE_URL is correct');
    console.log('   3. Ensure Supabase project is running');
    console.log('   4. Check firewall/network restrictions');
    console.log('   5. Try using port 6543 (pooled) instead of 5432');
    console.log('\n' + '=' .repeat(50) + '\n');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

diagnoseConnection().catch(err => {
  console.error('Diagnostic error:', err);
  process.exit(1);
});
