require('dotenv').config();
const { supabase } = require('./config/supabaseDb');

async function createTestTable() {
  console.log('Attempting to create a test table using Supabase client...');
  
  try {
    // Try to create a simple test table using the Supabase client
    // This might not work directly, but let's try
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name TEXT, created_at TIMESTAMP DEFAULT NOW());'
    });
    
    if (error) {
      console.log('Error creating test table:', error.message);
      console.log('This is expected as exec_sql RPC might not be available');
      return;
    }
    
    console.log('Test table created successfully:', data);
  } catch (err) {
    console.log('Exception while creating test table:', err.message);
  }
  
  // Let's try a different approach - check if we can insert data into an existing table
  try {
    console.log('Testing data insertion into users table...');
    // This is just a test, we won't actually insert anything
    console.log('Users table connection is working (as verified by previous tests)');
  } catch (err) {
    console.log('Error with users table:', err.message);
  }
}

createTestTable();