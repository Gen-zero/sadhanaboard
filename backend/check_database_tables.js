require('dotenv').config();
const { supabase } = require('./config/supabaseDb');

async function checkTables() {
  console.log('Checking what tables exist in the database...');
  
  try {
    // List all tables
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (error) {
      console.log('Error fetching tables:', error.message);
      return;
    }
    
    console.log('Tables in database:');
    data.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
    
    // Check for specific tables mentioned in the error
    const tablesToCheck = ['books', 'sadhanas', 'sadhana_sessions', 'users', 'profiles'];
    
    console.log('\nChecking specific tables:');
    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
          
        if (error) {
          console.log(`  ${tableName}: ❌ ${error.message}`);
        } else {
          console.log(`  ${tableName}: ✅ Exists (${data.length} rows returned)`);
        }
      } catch (err) {
        console.log(`  ${tableName}: ❌ Error - ${err.message}`);
      }
    }
  } catch (err) {
    console.error('Error checking tables:', err.message);
  }
}

checkTables();