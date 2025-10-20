const path = require('path');
const fs = require('fs').promises;
const BookService = require('../services/bookService');
const db = require('../config/db');

// Usage: node addExistingBookToLibrary.js <filename> '<jsonMetadata>'
// Example: node addExistingBookToLibrary.js yantras-heavenly-geometries.pdf '{"title":"Yantras: Heavenly Geometries","author":"Unknown","traditions":["Tantra"],"description":"Yantras and sacred geometry","year":2001,"language":"english"}'

async function main() {
  try {
    const args = process.argv.slice(2);
    if (args.length < 2) {
      console.error('Usage: node addExistingBookToLibrary.js <filename> <json-metadata>');
      process.exit(2);
    }

    const filename = args[0];
    const metaJson = args[1];
    const meta = JSON.parse(metaJson);

    // Check if file exists in uploads directory
    const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');
    const filePath = path.join(uploadsDir, filename);
    
    try {
      await fs.access(filePath);
    } catch (e) {
      console.error('File not found in uploads directory:', filePath);
      process.exit(1);
    }

    // Get file stats
    const stats = await fs.stat(filePath);

    // Create book metadata
    const bookData = Object.assign({}, meta, {
      storage_url: `/uploads/${filename}`,
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
    console.log('Created book with ID:', created.id);
    console.log('Book title:', created.title);
    process.exit(0);
  } catch (e) {
    console.error('Error adding book:', e);
    process.exit(1);
  }
}

main();