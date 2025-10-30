require('dotenv').config({ path: __dirname + '/.env' });
const db = require('./config/db');

async function testAppDatabaseConnection() {
  console.log('=== Testing Application Database Connection ===');
  
  try {
    // Test the connection using the application's database module
    const connectionTest = await db.getConnectionTestResult();
    console.log('Connection test result:', connectionTest);
    
    if (connectionTest.success) {
      console.log('✅ Application database connection is working!');
      
      // Try a simple query
      try {
        const result = await db.query('SELECT COUNT(*) as count FROM users');
        console.log('✅ Simple query test passed:', result.rows[0]);
      } catch (queryError) {
        console.log('⚠️  Query test had issues (may be expected):', queryError.message);
        console.log('This is normal if tables do not exist yet.');
      }
      
      return true;
    } else {
      console.log('❌ Application database connection failed:', connectionTest.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Application database connection test failed:', error.message);
    return false;
  }
}

testAppDatabaseConnection().then(success => {
  if (success) {
    console.log('\n🎉 Application database connection is ready!');
  } else {
    console.log('\n💥 Application database connection has issues.');
  }
  process.exit(success ? 0 : 1);
});