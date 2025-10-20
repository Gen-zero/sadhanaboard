const db = require('../config/db');

async function verifyBook() {
  try {
    console.log('Checking for the yantras book...');
    
    // Check if the book exists
    const result = await db.query(
      'SELECT id, title, author, storage_url, is_storage_file, content FROM spiritual_books WHERE title = $1', 
      ['Yantras: Heavenly Geometries']
    );
    
    if (result.rows.length > 0) {
      console.log('Book found in database:');
      console.log('ID:', result.rows[0].id);
      console.log('Title:', result.rows[0].title);
      console.log('Author:', result.rows[0].author);
      console.log('Storage URL:', result.rows[0].storage_url);
      console.log('Is storage file:', result.rows[0].is_storage_file);
      console.log('Content length:', result.rows[0].content ? result.rows[0].content.length : 0);
    } else {
      console.log('Book not found in database');
    }
    
    // Also check the total count of books
    const countResult = await db.query('SELECT COUNT(*) as total FROM spiritual_books');
    console.log('Total books in database:', countResult.rows[0].total);
    
    // List all books
    const allBooks = await db.query('SELECT id, title, author, created_at FROM spiritual_books ORDER BY created_at DESC LIMIT 5');
    console.log('Recent books:');
    allBooks.rows.forEach(book => {
      console.log(`- ${book.title} by ${book.author} (ID: ${book.id})`);
    });
    
  } catch (error) {
    console.error('Error verifying book:', error);
  } finally {
    process.exit(0);
  }
}

verifyBook();