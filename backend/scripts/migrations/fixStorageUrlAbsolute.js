const db = require('../config/db');

async function fixStorageUrlAbsolute() {
  try {
    console.log('Fixing storage URL to absolute path for Yantras book...');
    
    // Update the book to use the correct absolute storage URL
    const result = await db.query(
      `UPDATE spiritual_books 
       SET storage_url = $1
       WHERE title = $2
       RETURNING id, title, storage_url`,
      ['/uploads/yantras-heavenly-geometries.pdf', 'Yantras: Heavenly Geometries']
    );
    
    if (result.rows.length > 0) {
      const book = result.rows[0];
      console.log(`Updated book: ${book.title}`);
      console.log(`Storage URL is now: ${book.storage_url}`);
      console.log('Note: The frontend should construct the full URL by prepending the API base URL');
    } else {
      console.log('Book not found');
    }
    
  } catch (error) {
    console.error('Error fixing storage URL:', error);
  } finally {
    process.exit(0);
  }
}

fixStorageUrlAbsolute();