const BookService = require('../services/bookService');

async function checkApiResponse() {
  try {
    console.log('Checking API response format...');
    
    // Fetch books without any filters
    const result = await BookService.getBooks({});
    
    console.log('API Response structure:');
    console.log('- Total books:', result.total);
    console.log('- Books array length:', result.books.length);
    
    if (result.books.length > 0) {
      const book = result.books[0];
      console.log('First book structure:');
      Object.keys(book).forEach(key => {
        console.log(`  ${key}: ${JSON.stringify(book[key])} (${typeof book[key]})`);
      });
    }
    
    // Check if our specific book is in the results
    const yantrasBook = result.books.find(book => book.title === 'Yantras: Heavenly Geometries');
    if (yantrasBook) {
      console.log('\nYantras book found:');
      Object.keys(yantrasBook).forEach(key => {
        console.log(`  ${key}: ${JSON.stringify(yantrasBook[key])} (${typeof yantrasBook[key]})`);
      });
    } else {
      console.log('\nYantras book NOT found in results');
    }
    
  } catch (error) {
    console.error('Error checking API response:', error);
  } finally {
    process.exit(0);
  }
}

checkApiResponse();