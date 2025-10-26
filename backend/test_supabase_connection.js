const { createClient } = require('@supabase/supabase-js');

// Test Supabase connection
const supabaseUrl = process.env.SUPABASE_URL || 'https://bhasogcwwjsjzjkckzeh.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoYXNvZ2N3d2pzanpqa2NremVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTAwOTAxMywiZXhwIjoyMDc2NTg1MDEzfQ.VPtBZUZTrLi73XHCeQe8FMhUYIqb9gBhBm6XbEmxarM';

console.log('Testing Supabase connection...');
console.log('Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

async function testConnection() {
  try {
    // Test a simple query
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase query error:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful!');
    console.log('Sample data retrieved:', data.length, 'records');
    return true;
  } catch (err) {
    console.error('Supabase connection failed:', err.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('✅ Supabase connection test passed');
  } else {
    console.log('❌ Supabase connection test failed');
  }
  process.exit(success ? 0 : 1);
});