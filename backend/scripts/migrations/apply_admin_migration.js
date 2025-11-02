const fs = require('fs');
const path = require('path');
const db = require('../../config/db');

(async () => {
  try {
    const migrationPath = path.join(__dirname, '..', '..', 'supabase', 'migrations', '20250107000000_create_admin_details_table.sql');
    if (!fs.existsSync(migrationPath)) {
      console.error('Migration file not found:', migrationPath);
      process.exit(1);
    }
    const sql = fs.readFileSync(migrationPath, 'utf8');
    // check if table exists
    const existsRes = await db.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='admin_details')");
    const exists = existsRes.rows && existsRes.rows[0] && existsRes.rows[0].exists;
    if (exists) {
      console.log('admin_details already exists; skipping migration.');
      return process.exit(0);
    }
    console.log('Applying admin_details migration...');
    await db.query(sql);
    console.log('admin_details migration applied successfully.');
    process.exit(0);
  } catch (e) {
    console.error('Failed to apply admin migration:', e && e.message ? e.message : e);
    process.exit(2);
  }
})();