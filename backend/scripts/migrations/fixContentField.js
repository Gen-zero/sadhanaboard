const db = require('../config/db');

async function fixContentField() {
  try {
    console.log('Setting content field to null for Yantras book...');
    
    // Update the book to set content to null
    const result = await db.query(
      `UPDATE spiritual_books 
       SET content = NULL
       WHERE title = $1
       RETURNING id, title, content`,
      ['Yantras: Heavenly Geometries']
    );
    
    if (result.rows.length > 0) {
      const book = result.rows[0];
      console.log(`Updated book: ${book.title}`);
      console.log(`Content is now: ${book.content} (${typeof book.content})`);
    } else {
      console.log('Book not found');
    }
    
  } catch (error) {
    console.error('Error fixing content field:', error);
  } finally {
    process.exit(0);
  }
}

fixContentField();