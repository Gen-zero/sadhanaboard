const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function run() {
  try {
    const migrationsDir = path.resolve(__dirname, '../../supabase/migrations');
    const filename = '20250108000000_add_book_soft_delete.sql';
    const filePath = path.join(migrationsDir, filename);

    if (!fs.existsSync(filePath)) {
      console.error(`Migration file not found: ${filePath}`);
      process.exit(1);
    }

    const sql = fs.readFileSync(filePath, { encoding: 'utf8' });
    console.log(`Applying migration ${filename}...`);
    await db.query(sql);
    console.log('Migration applied successfully.');
  } catch (err) {
    console.error('Failed to apply migration:', err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
