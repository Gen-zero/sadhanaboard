const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function applyMigration() {
  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '..', 'migrations', '0004_add_deleted_at_to_spiritual_books.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Applying migration:', migrationPath);
    
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