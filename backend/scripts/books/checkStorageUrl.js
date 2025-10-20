const db = require('../config/db');

async function checkStorageUrl() {
  try {
    console.log('Checking storage URL for Yantras book...');
    
    // Check the current storage URL
    const result = await db.query(
      'SELECT title, storage_url FROM spiritual_books WHERE title = $1',
      ['Yantras: Heavenly Geometries']
    );
    
    if (result.rows.length > 0) {
      const book = result.rows[0];
      console.log(`Book: ${book.title}`);
      console.log(`Storage URL: ${book.storage_url}`);
    } else {
      console.log('Book not found');
    }
    
  } catch (error) {
    console.error('Error checking storage URL:', error);
  } finally {
    process.exit(0);
  }
}

checkStorageUrl();