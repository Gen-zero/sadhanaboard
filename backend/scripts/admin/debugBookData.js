const db = require('../config/db');

async function debugBookData() {
  try {
    console.log('Debugging book data...');
    
    // Get all columns for the yantras book
    const result = await db.query(
      'SELECT * FROM spiritual_books WHERE title = $1', 
      ['Yantras: Heavenly Geometries']
    );
    
    if (result.rows.length > 0) {
      console.log('Book data:');
      const book = result.rows[0];
      Object.keys(book).forEach(key => {
        console.log(`${key}: ${book[key]} (${typeof book[key]})`);
      });
    } else {
      console.log('Book not found');
      
      // Let's check what books exist
      const allBooks = await db.query('SELECT id, title, author, traditions FROM spiritual_books ORDER BY created_at DESC LIMIT 10');
      console.log('Recent books in database:');
      allBooks.rows.forEach((book, index) => {
        console.log(`${index + 1}. ${book.title} by ${book.author} (ID: ${book.id})`);
        console.log(`   Traditions: ${Array.isArray(book.traditions) ? book.traditions.join(', ') : book.traditions}`);
      });
    }
    
  } catch (error) {
    console.error('Error debugging book data:', error);
  } finally {
    process.exit(0);
  }
}

debugBookData();