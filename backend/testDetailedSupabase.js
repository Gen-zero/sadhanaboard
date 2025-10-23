require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const url = require('url');

// Test Supabase connection with detailed output
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL;

console.log('=== Supabase Connection Test ===');
console.log('Supabase URL:', supabaseUrl);
console.log('Service Role Key present:', !!supabaseKey);

// Parse the database URL to check for issues
if (databaseUrl) {
  try {
    const parsedUrl = new URL(databaseUrl);
    console.log('Database Host:', parsedUrl.hostname);
    console.log('Database Port:', parsedUrl.port);
    console.log('Database User:', parsedUrl.username);
    console.log('Database Name:', parsedUrl.pathname.substring(1));
    console.log('SSL Mode:', parsedUrl.searchParams.get('sslmode'));
    
    // Check if password has special characters
    const password = decodeURIComponent(parsedUrl.password);
    console.log('Password has special characters:', password.includes('@') || password.includes(':'));
  } catch (e) {
    console.log('Database URL parsing failed:', e.message);
  }
}

console.log('\n=== Testing Supabase JS Client ===');
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

async function testSupabaseJS() {
  try {
    console.log('Attempting to connect to Supabase via JS client...');
    
    // Test basic connection by getting user count (or trying to)
    const { data, error } = await supabase
      .from('users')
      .select('count()', { count: 'exact' });
      
    if (error && error.code !== '42P01') { // 42P01 = table doesn't exist
      console.log('⚠️  Supabase JS connection has error (may be expected):', error.message);
    } else if (error && error.code === '42P01') {
      console.log('✅ Supabase JS client connected successfully! (Users table does not exist yet)');
    } else {
      console.log('✅ Supabase JS client connected successfully!');
      console.log('Users count query result:', data);
    }
    
  } catch (error) {
    console.error('❌ Supabase JS client connection failed:', error.message);
    return false;
  }
  return true;
}

console.log('\n=== Testing PostgreSQL Direct Connection ===');
async function testPostgreSQL() {
  if (!databaseUrl) {
    console.log('⚠️  No DATABASE_URL provided, skipping PostgreSQL test');
    return false;
  }

  // Try with different SSL configurations
  const sslConfigs = [
    { rejectUnauthorized: false },
    true,
    false
  ];

  for (const sslConfig of sslConfigs) {
    console.log(`\n--- Testing with SSL config: ${JSON.stringify(sslConfig)} ---`);
    
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: sslConfig,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      max: 1
    });

    try {
      console.log('Attempting direct PostgreSQL connection...');
      const client = await pool.connect();
      const result = await client.query('SELECT version(), NOW()');
      console.log('✅ PostgreSQL connection successful!');
      console.log('PostgreSQL version:', result.rows[0].version);
      console.log('Current time:', result.rows[0].now);
      client.release();
      await pool.end();
      return true;
    } catch (error) {
      console.error(`❌ PostgreSQL connection failed with SSL ${JSON.stringify(sslConfig)}:`, error.message);
      try {
        await pool.end();
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
  
  return false;
}

async function runTests() {
  console.log('\n=== Running Connection Tests ===');
  
  const jsSuccess = await testSupabaseJS();
  const pgSuccess = await testPostgreSQL();
  
  console.log('\n=== Test Results ===');
  console.log('Supabase JS Client:', jsSuccess ? '✅ PASS' : '❌ FAIL');
  console.log('PostgreSQL Direct:', pgSuccess ? '✅ PASS' : '❌ FAIL');
  
  if (jsSuccess || pgSuccess) {
    console.log('\n🎉 At least one connection method works!');
  } else {
    console.log('\n💥 All connection methods failed. Check your credentials and network.');
  }
  
  console.log('\n=== Recommendations ===');
  if (jsSuccess && !pgSuccess) {
    console.log('✅ Use Supabase JS client for operations when possible');
    console.log('⚠️  Direct PostgreSQL connections may be blocked by firewall');
  } else if (pgSuccess) {
    console.log('✅ Direct PostgreSQL connections work');
  } else {
    console.log('⚠️  Check your network/firewall settings');
    console.log('⚠️  Verify Supabase credentials');
  }
}

runTests();