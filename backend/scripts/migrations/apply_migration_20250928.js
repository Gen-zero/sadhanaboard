const fs = require('fs');
const path = require('path');
const db = require('../config/db');

(async () => {
  try {
  const migrationPath = path.join(__dirname, '..', '..', 'supabase', 'migrations', '20250928000001_create_sadhana_activity_and_spiritual_milestones.sql');
    if (!fs.existsSync(migrationPath)) {
      console.error('Migration file not found:', migrationPath);
      process.exit(1);
    }
    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log('Applying migration 20250928...');
    await db.query(sql);
    console.log('Migration applied successfully.');
  } catch (e) {
    console.error('Failed to apply migration:', e.message);
    console.error(e);
  } finally {
    process.exit(0);
  }
})();
