const db = require('../config/db');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic query
    const result = await db.query('SELECT NOW() as now');
    console.log('Database connection successful!');
    console.log('Current time:', result.rows[0].now);
    
    // Test table existence
    const tables = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\nDatabase tables:');
    tables.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('Database connection failed:', error.message);
  } finally {
    process.exit(0);
  }
}

testConnection();