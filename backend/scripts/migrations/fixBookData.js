const db = require('../config/db');

async function fixBookData() {
  try {
    console.log('Fixing book data...');
    
    // Update the book to ensure all required fields are properly set
    const result = await db.query(
      `UPDATE spiritual_books 
       SET user_id = COALESCE(user_id, '00000000-0000-0000-0000-000000000000'),
           content = COALESCE(content, ''),
           traditions = COALESCE(traditions, '{}'),
           language = COALESCE(language, 'english'),
           updated_at = NOW()
       WHERE title = $1
       RETURNING *`, 
      ['Yantras: Heavenly Geometries']
    );
    
    if (result.rows.length > 0) {
      console.log('Book updated successfully:');
      const book = result.rows[0];
      console.log('ID:', book.id);
      console.log('Title:', book.title);
      console.log('Author:', book.author);
      console.log('User ID:', book.user_id);
      console.log('Traditions:', book.traditions);
      console.log('Content length:', book.content ? book.content.length : 0);
      console.log('Language:', book.language);
    } else {
      console.log('Book not found');
    }
    
  } catch (error) {
    console.error('Error fixing book data:', error);
  } finally {
    process.exit(0);
  }
}

fixBookData();