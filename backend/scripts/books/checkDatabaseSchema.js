const db = require('../config/db');

async function checkDatabaseSchema() {
  try {
    console.log('Checking if required columns exist in spiritual_books table...');
    
    // Check if the required columns exist
    const result = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'spiritual_books' 
      AND column_name IN ('storage_url', 'is_storage_file', 'deleted_at', 'file_size')
      ORDER BY column_name;
    `);
    
    console.log('Found columns:');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });
    
    // Check if book_progress table has time_spent_minutes column
    const progressResult = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'book_progress' 
      AND column_name = 'time_spent_minutes'
      ORDER BY column_name;
    `);
    
    console.log('\nBook progress columns:');
    progressResult.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking database schema:', error);
    process.exit(1);
  }
}

checkDatabaseSchema();