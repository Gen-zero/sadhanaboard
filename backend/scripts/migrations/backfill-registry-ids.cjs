const db = require('../config/db');
const themeRegistry = require('../utils/themeRegistry');

async function backfill() {
  try {
    const registry = themeRegistry.getRegistry();
    const ids = registry.map(r => String(r.id));
    console.log('Loaded registry ids:', ids.join(', '));

    // Find cms_themes rows missing registry_id
    const r = await db.query("SELECT id, name, description FROM cms_themes WHERE registry_id IS NULL OR registry_id = ''");
    if (!r.rows.length) {
      console.log('No rows to backfill.');
      process.exit(0);
    }

    for (const row of r.rows) {
      // try to match by name or deity using simple heuristic
      const nameLower = (row.name || '').toLowerCase();
      const match = registry.find(t => {
        const m = (t.metadata && (t.metadata.id || t.metadata.name || t.metadata.deity || '') + '').toLowerCase();
        return m && (m === nameLower || m.includes(nameLower) || nameLower.includes(m));
      });
      if (match) {
        await db.query('UPDATE cms_themes SET registry_id = $1 WHERE id = $2', [String(match.id), row.id]);
        console.log(`Backfilled theme id ${row.id} -> registry_id ${match.id}`);
      } else {
        console.log(`No match for theme id ${row.id} (name: ${row.name})`);
      }
    }

    console.log('Backfill complete');
    process.exit(0);
  } catch (e) {
    console.error('Backfill error', e);
    process.exit(1);
  }
}

backfill();
