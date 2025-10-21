require('dotenv').config();
const db = require('./config/db');

async function testDatabaseConnection() {
  console.log('Testing database connection...');
  console.log('Using Supabase database:', process.env.SUPABASE_URL);
  
  try {
    // Test basic connection
    const result = await db.query('SELECT NOW() as now');
    console.log('✅ Database connection successful:', result.rows[0].now);
    
    // Test if required tables exist
    const tables = [
      'users', 'sadhanas', 'sadhana_progress', 'sadhana_activity', 
      'spiritual_milestones', 'report_templates'
    ];
    
    for (const table of tables) {
      try {
        const tableCheck = await db.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = $1
          ) as exists
        `, [table]);
        
        if (tableCheck.rows[0].exists) {
          console.log(`✅ Table ${table} exists`);
        } else {
          console.log(`❌ Table ${table} does not exist`);
        }
      } catch (tableErr) {
        console.log(`⚠️  Error checking table ${table}:`, tableErr.message);
      }
    }
    
    // Test BI query
    try {
      const biTest = await db.query('SELECT COUNT(*)::int as total FROM users');
      console.log('✅ BI query test successful:', biTest.rows[0]);
    } catch (biErr) {
      console.log('❌ BI query test failed:', biErr.message);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error code:', error.code);
    process.exit(1);
  }
}

testDatabaseConnection();