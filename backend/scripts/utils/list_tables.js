const db = require('../config/db');

(async () => {
  try {
    const res = await db.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
    console.log('public tables:', res.rows.map(r => r.tablename));
  } catch (e) {
    console.error('error listing tables:', e);
  } finally {
    process.exit(0);
  }
})();
