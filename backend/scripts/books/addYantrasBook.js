const path = require('path');
const fs = require('fs').promises;
const BookService = require('../services/bookService');
const db = require('../config/db');

async function main() {
  try {
    // Check if file exists in uploads directory
    const filename = 'yantras-heavenly-geometries.pdf';
    const uploadsDir = path.resolve(__dirname, '..', 'uploads');
    const filePath = path.join(uploadsDir, filename);
    
    console.log('Looking for file at:', filePath);
    
    try {
      await fs.access(filePath);
      console.log('File found!');
    } catch (e) {
      console.error('File not found in uploads directory:', filePath);
      // List files in directory to help debug
      try {
        const files = await fs.readdir(uploadsDir);
        console.log('Files in uploads directory:', files);
      } catch (dirErr) {
        console.error('Could not read uploads directory:', dirErr.message);
      }
      process.exit(1);
    }

    // Get file stats
    const stats = await fs.stat(filePath);
    console.log('File size:', stats.size);

    // Create book metadata
    const bookData = {
      title: 'Yantras: Heavenly Geometries',
      author: 'Unknown',
      traditions: ['Tantra', 'Hinduism'],
      description: 'Yantras and sacred geometry',
      year: 2001,
      language: 'english',
      storage_url: `/uploads/${filename}`,
      is_storage_file: true,
      content: '', // Empty string instead of null to satisfy not-null constraint
      file_size: stats.size
    };

    // For this script we use a default user id if none exists
    // Attempt to pick any existing user, otherwise null
    let userId = null;
    try {
      const r = await db.query('SELECT id FROM users LIMIT 1');
      if (r.rows && r.rows[0]) userId = r.rows[0].id;
      console.log('Using user ID:', userId);
    } catch (e) {
      console.warn('Could not fetch user id, setting null (will fail if user_id NOT NULL):', e.message || e);
    }

    console.log('Creating book with data:', bookData);
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