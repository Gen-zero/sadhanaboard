const path = require('path');
const fs = require('fs').promises;
const BookService = require('../services/bookService');
const db = require('../config/db');

// Usage: node addBookFromFile.js <relativePathToFile> '<jsonMetadata>'
// Example: node addBookFromFile.js ../Books/yantras-heavenly-geometries.pdf '{"title":"Yantras: Heavenly Geometries","author":"Unknown","traditions":["Tantra"],"description":"Yantras and sacred geometry","year":2001,"language":"english"}'

async function main() {
  try {
    const args = process.argv.slice(2);
    if (args.length < 2) {
      console.error('Usage: node addBookFromFile.js <path-to-pdf> <json-metadata>');
      process.exit(2);
    }

    const filePath = path.resolve(__dirname, '..', args[0]);
    const metaJson = args[1];
    const meta = JSON.parse(metaJson);

    // Ensure uploads dir exists
    const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Copy file into uploads with a safe filename
    const basename = path.basename(filePath);
    const uniqueName = `book-${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(basename)}`;
    const destPath = path.join(uploadsDir, uniqueName);
    await fs.copyFile(filePath, destPath);

    const stats = await fs.stat(destPath);

    // Create book metadata
    const bookData = Object.assign({}, meta, {
      storage_url: `/uploads/${uniqueName}`,
      is_storage_file: true,
      content: null,
      file_size: stats.size
    });

    // For this script we use a default user id if none exists
    // Attempt to pick any existing user, otherwise null
    let userId = null;
    try {
      const r = await db.query('SELECT id FROM users LIMIT 1');
      if (r.rows && r.rows[0]) userId = r.rows[0].id;
    } catch (e) {
      console.warn('Could not fetch user id, setting null (will fail if user_id NOT NULL):', e.message || e);
    }

    const created = await BookService.createBook(bookData, userId);
    console.log('Created book:', created.id);
    process.exit(0);
  } catch (e) {
    console.error('Error adding book:', e);
    process.exit(1);
  }
}

main();
