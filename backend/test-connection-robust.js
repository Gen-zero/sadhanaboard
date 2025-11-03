#!/usr/bin/env node

/**
 * Robust Database Connection Test
 * Tries multiple connection approaches to diagnose issues
 */

require('dotenv').config({ path: '.env.development' });
const { Pool } = require('pg');
const dns = require('dns').promises;

async function robustConnectionTest() {
  console.log('🔍 Robust Database Connection Diagnostic\n');
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
    const addresses4 = await dns.resolve4(urlObj.hostname);
    console.log(`   ✓ IPv4 addresses: ${addresses4.join(', ')}`);
  } catch (err) {
    console.log(`   ✗ IPv4 resolution failed: ${err.message}`);
  }
  
  try {
    const addresses6 = await dns.resolve6(urlObj.hostname);
    console.log(`   ✓ IPv6 addresses: ${addresses6.join(', ')}`);
  } catch (err) {
    console.log(`   ✗ IPv6 resolution failed: ${err.message}`);
  }
  
  // Test 1: Standard connection
  console.log(`\n🔌 Test 1: Standard Connection...`);
  try {
    const pool1 = new Pool({
      connectionString: dbUrl,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 10000,
      max: 1
    });
    
    const client = await pool1.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    await pool1.end();
    
    console.log('   ✓ Standard connection successful!');
    console.log(`   Current server time: ${result.rows[0].now}`);
  } catch (error) {
    console.log(`   ✗ Standard connection failed: ${error.message}`);
  }
  
  // Test 2: Force IPv4
  console.log(`\n🔌 Test 2: Force IPv4 Connection...`);
  try {
    // Try with family: 4
    const pool2 = new Pool({
      connectionString: dbUrl,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 10000,
      max: 1,
      family: 4
    });
    
    const client = await pool2.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    await pool2.end();
    
    console.log('   ✓ IPv4 connection successful!');
    console.log(`   Current server time: ${result.rows[0].now}`);
  } catch (error) {
    console.log(`   ✗ IPv4 connection failed: ${error.message}`);
  }
  
  // Test 3: Direct IPv4 if available
  console.log(`\n🔌 Test 3: Direct IPv4 Connection (if available)...`);
  try {
    const addresses4 = await dns.resolve4(urlObj.hostname);
    if (addresses4.length > 0) {
      const directUrl = `postgresql://${urlObj.username}:${urlObj.password}@${addresses4[0]}:${urlObj.port || 5432}${urlObj.pathname}${urlObj.search}`;
      
      const pool3 = new Pool({
        connectionString: directUrl,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 10000,
        max: 1
      });
      
      const client = await pool3.connect();
      const result = await client.query('SELECT NOW()');
      client.release();
      await pool3.end();
      
      console.log('   ✓ Direct IPv4 connection successful!');
      console.log(`   Current server time: ${result.rows[0].now}`);
    } else {
      console.log('   ⚠️  No IPv4 addresses available');
    }
  } catch (error) {
    console.log(`   ✗ Direct IPv4 connection failed: ${error.message}`);
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('💡 Summary:');
  console.log('   If none of the tests worked, the issue is likely:');
  console.log('   - Network/firewall blocking the connection');
  console.log('   - ISP not allowing connections to Supabase');
  console.log('   - Supabase project not properly configured');
  console.log('\n   Try:');
  console.log('   - Using a VPN');
  console.log('   - Connecting from a different network');
  console.log('   - Checking Windows Firewall settings');
  console.log('   - Verifying Supabase project is active');
}

robustConnectionTest().catch(err => {
  console.error('Diagnostic error:', err);
  process.exit(1);
});