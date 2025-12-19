console.log('Loading environment...');
require('dotenv').config({ path: '.env.development' });
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const db = require('./config/db');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    // Get migration file name from command line arguments
    const migrationFileName = process.argv[2];
    if (!migrationFileName) {
      console.error('Please provide a migration file name as an argument');
      process.exit(1);
    }
    
    const migrationPath = path.join(__dirname, 'migrations', migrationFileName);
    console.log('Reading migration file:', migrationPath);
    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log('Executing migration...');
    await db.query(sql);
    console.log('Migration applied successfully.');
    process.exit(0);
  } catch (e) {
    console.error('Failed to apply migration:', e && e.message ? e.message : e);
    process.exit(2);
  }
}

run();