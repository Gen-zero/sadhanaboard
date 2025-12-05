require('dotenv').config({ path: '.env.development' });
const { connectMongoDB, getConnectionTestResult } = require('./config/mongodb');

async function testMongoDBConnection() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   MongoDB Atlas Connection Test       ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set (hidden for security)' : 'NOT SET');
    console.log('\nAttempting to connect to MongoDB Atlas...\n');

    const result = await getConnectionTestResult();
    
    if (result.success) {
      console.log('✓ SUCCESS: Connected to MongoDB Atlas!');
      console.log(`  Method: ${result.method}`);
      console.log(`  Timestamp: ${new Date().toISOString()}\n`);
      
      console.log('╔════════════════════════════════════════╗');
      console.log('║        Connection Successful           ║');
      console.log('╚════════════════════════════════════════╝\n');
      
      process.exit(0);
    } else {
      console.log('✗ FAILED: Could not connect to MongoDB Atlas');
      console.log(`  Error: ${result.error}`);
      console.log(`  Method: ${result.method}\n`);
      
      console.log('╔════════════════════════════════════════╗');
      console.log('║        Connection Failed              ║');
      console.log('╚════════════════════════════════════════╝\n');
      
      process.exit(1);
    }
  } catch (error) {
    console.log('✗ ERROR: Exception occurred during connection test');
    console.log(`  Error: ${error.message}`);
    console.log(`  Stack: ${error.stack}\n`);
    
    console.log('╔════════════════════════════════════════╗');
    console.log('║           Error Occurred              ║');
    console.log('╚════════════════════════════════════════╝\n');
    
    process.exit(1);
  }
}

testMongoDBConnection();
