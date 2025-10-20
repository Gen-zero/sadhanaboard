const db = require('../config/db');

async function checkBookData() {
  try {
    console.log('Checking book data for Yantras book...');
    
    // Get the book data
    const result = await db.query(
      'SELECT * FROM spiritual_books WHERE title = $1',
      ['Yantras: Heavenly Geometries']
    );
    
    if (result.rows.length > 0) {
      const book = result.rows[0];
      console.log('Book data:');
      console.log('- ID:', book.id);
      console.log('- Title:', book.title);
      console.log('- Author:', book.author);
      console.log('- Storage URL:', book.storage_url);
      console.log('- Is storage file:', book.is_storage_file);
      console.log('- Content length:', book.content ? book.content.length : 0);
      console.log('- Traditions:', book.traditions);
      console.log('- File size:', book.file_size);
    } else {
      console.log('Book not found');
    }
    
  } catch (error) {
    console.error('Error checking book data:', error);
  } finally {
    process.exit(0);
  }
}

checkBookData();