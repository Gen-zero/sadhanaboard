const db = require('./config/db');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await db.getConnectionTestResult();
    console.log('Connection test result:', result);
    
    if (result.success) {
      console.log('Database connection successful!');
      
      // Try to query the custom_sadhanas table
      try {
        const tableCheck = await db.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'custom_sadhanas'
          );
        `);
        console.log('Table existence check:', tableCheck.rows[0]);
      } catch (tableError) {
        console.log('Table check error:', tableError.message);
      }
    } else {
      console.log('Database connection failed:', result.error);
    }
  } catch (error) {
    console.error('Test connection error:', error.message);
  }
}

testConnection();