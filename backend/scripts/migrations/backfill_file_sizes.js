const db = require('../config/db');
const fs = require('fs').promises;
const path = require('path');

async function backfillFileSizes() {
  console.log('Starting backfill of file sizes...');
  const client = await db.connect();
  try {
    const res = await client.query(`SELECT id, storage_url FROM spiritual_books WHERE is_storage_file = true AND (file_size IS NULL) AND deleted_at IS NULL`);
    const rows = res.rows || [];
    console.log(`Found ${rows.length} books to process`);
    let success = 0;
    let skipped = 0;
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      try {
        const filename = r.storage_url.replace('/uploads/', '');
        const filePath = path.join(__dirname, '../../uploads', filename);
        await fs.access(filePath);
        const stats = await fs.stat(filePath);
        const size = stats.size;
        await client.query(`UPDATE spiritual_books SET file_size = $1 WHERE id = $2`, [size, r.id]);
        success++;
        if (i % 10 === 0) console.log(`Processed ${i+1}/${rows.length}`);
      } catch (e) {
        skipped++;
        console.error(`Failed for ${r.id}:`, e.message || e);
      }
    }
    console.log(`Done. Success: ${success}, Skipped: ${skipped}`);
  } catch (e) {
    console.error('Fatal error during backfill:', e.message || e);
  } finally {
    client.release();
  }
}

if (require.main === module) {
  backfillFileSizes().then(() => { console.log('Backfill complete'); process.exit(0); }).catch(err => { console.error(err); process.exit(1); });
}

module.exports = backfillFileSizes;
