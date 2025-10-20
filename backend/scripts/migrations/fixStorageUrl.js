const db = require('../config/db');

async function fixStorageUrl() {
  try {
    console.log('Fixing storage URL for Yantras book...');
    
    // Update the book to use the correct storage URL format
    const result = await db.query(
      `UPDATE spiritual_books 
       SET storage_url = $1
       WHERE title = $2
       RETURNING id, title, storage_url`,
      ['/api/books/files/yantras-heavenly-geometries.pdf', 'Yantras: Heavenly Geometries']
    );
    
    if (result.rows.length > 0) {
      const book = result.rows[0];
      console.log(`Updated book: ${book.title}`);
      console.log(`Storage URL is now: ${book.storage_url}`);
    } else {
      console.log('Book not found');
    }
    
  } catch (error) {
    console.error('Error fixing storage URL:', error);
  } finally {
    process.exit(0);
  }
}

fixStorageUrl();