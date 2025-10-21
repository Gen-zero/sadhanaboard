require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Test Supabase connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing Supabase connection with:');
console.log('- URL:', supabaseUrl);
console.log('- Key:', supabaseKey ? '***REDACTED***' : 'NOT SET');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

async function testConnection() {
  try {
    console.log('Attempting to connect to Supabase...');
    
    // Test database access by trying to select from a table
    // This should work with service role key
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
      
    if (error && error.code !== '42P01') { // 42P01 = table doesn't exist, which is OK
      console.error('❌ Supabase connection failed:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error);
      return;
    }
    
    if (error && error.code === '42P01') {
      console.log('✅ Successfully connected to Supabase! (Table does not exist yet, which is expected)');
    } else {
      console.log('✅ Successfully connected to Supabase!');
      console.log('Users query successful');
    }
    
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    console.error('Error details:', error);
  }
}

testConnection();