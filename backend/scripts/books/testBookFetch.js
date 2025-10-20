const BookService = require('../services/bookService');

async function testBookFetch() {
  try {
    console.log('Testing book fetch...');
    
    // Fetch books without any filters
    const result = await BookService.getBooks({});
    
    console.log(`Found ${result.books.length} books out of ${result.total} total`);
    
    // Check if our book is in the results
    const yantrasBook = result.books.find(book => book.title === 'Yantras: Heavenly Geometries');
    if (yantrasBook) {
      console.log('Yantras book found in results:');
      console.log('- ID:', yantrasBook.id);
      console.log('- Title:', yantrasBook.title);
      console.log('- Author:', yantrasBook.author);
      console.log('- Traditions:', yantrasBook.traditions);
      console.log('- Is storage file:', yantrasBook.is_storage_file);
    } else {
      console.log('Yantras book NOT found in results');
      
      // List all books
      console.log('All books returned:');
      result.books.forEach((book, index) => {
        console.log(`${index + 1}. ${book.title} by ${book.author}`);
      });
    }
    
  } catch (error) {
    console.error('Error testing book fetch:', error);
  } finally {
    process.exit(0);
  }
}

testBookFetch();