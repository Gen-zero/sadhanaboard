const { supabase } = require('./config/supabaseDb');

async function inspectTables() {
  const tables = [
    'users', 
    'profiles', 
    'sadhanas', 
    'sadhana_progress', 
    'spiritual_books'
  ];

  console.log('Inspecting table structures in Supabase database...\n');
  
  for (const table of tables) {
    try {
      // Get table info from information_schema
      const { data, error } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', table)
        .order('ordinal_position');
      
      if (error) {
        console.log(`${table}: ERROR - ${error.message}\n`);
      } else {
        console.log(`${table}:`);
        data.forEach(col => {
          console.log(`  ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
        });
        console.log('');
      }
    } catch (err) {
      console.log(`${table}: EXCEPTION - ${err.message}\n`);
    }
  }
}

inspectTables();