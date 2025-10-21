const db = require('./config/db');

async function testDB() {
  try {
    console.log('Testing database connection...');
    const result = await db.query('SELECT NOW() as now');
    console.log('Database connection successful:', result.rows[0]);
    
    // Test if report_templates table exists
    try {
      const tableResult = await db.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_name = 'report_templates'
      `);
      console.log('report_templates table exists:', tableResult.rows.length > 0);
    } catch (tableErr) {
      console.log('Error checking table:', tableErr.message);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}

testDB();