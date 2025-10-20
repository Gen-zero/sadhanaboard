const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function applyMigration() {
  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '..', 'migrations', '0003_add_storage_columns_to_spiritual_books.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Applying migration:', migrationPath);
    console.log('SQL:', migrationSQL);
    
    // Execute the migration
    await db.query(migrationSQL);
    
    console.log('Migration applied successfully!');
  } catch (error) {
    console.error('Error applying migration:', error);
  } finally {
    process.exit(0);
  }
}

applyMigration();