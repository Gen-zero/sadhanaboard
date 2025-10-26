require('dotenv').config();
const { supabase } = require('./config/supabaseDb');

async function checkTables() {
  console.log('Checking what tables exist in the database...');
  
  // Check for specific tables mentioned in the error
  const tablesToCheck = ['books', 'sadhanas', 'sadhana_sessions', 'users', 'profiles', 'spiritual_books'];
  
  console.log('\nChecking specific tables:');
  for (const tableName of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('count()', { count: 'exact' });
        
      if (error) {
        console.log(`  ${tableName}: ❌ ${error.message}`);
      } else {
        console.log(`  ${tableName}: ✅ Exists (${data.length} rows returned)`);
      }
    } catch (err) {
      console.log(`  ${tableName}: ❌ Error - ${err.message}`);
    }
  }
  
  // Also check if we can query the users table which we know exists
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
      
    if (error) {
      console.log('users table query failed:', error.message);
    } else {
      console.log('users table query successful');
    }
  } catch (err) {
    console.log('users table query error:', err.message);
  }
}

checkTables();