const fs = require('fs');
const path = require('path');
const db = require('../config/db');

(async () => {
  try {
  // migration file lives at workspace root under supabase/migrations
  const migrationPath = path.join(__dirname, '..', '..', 'supabase', 'migrations', '20250106000005_create_system_monitoring_tables.sql');
    if (!fs.existsSync(migrationPath)) {
      console.error('Migration file not found:', migrationPath);
      process.exit(1);
    }
    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log('Applying system monitoring migration...');
    await db.query(sql);
    console.log('System monitoring migration applied successfully.');
  } catch (e) {
    console.error('Failed to apply migration:', e.message);
    console.error(e);
  } finally {
    process.exit(0);
  }
})();
