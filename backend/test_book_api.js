const adminAuthService = require('./services/adminAuthService');
const bookService = require('./services/bookService');
const db = require('./config/db');

async function testBookAPI() {
  try {
    // Login as admin
    console.log('Logging in as admin...');
    const { token, admin } = await adminAuthService.login({ 
      usernameOrEmail: 'KaliVaibhav', 
      password: 'Subham@98' 
    });
    console.log('Login successful:', admin.username);
    
    // Get a valid user ID from the users table
    console.log('Getting valid user ID...');
    const userResult = await db.query('SELECT id FROM users LIMIT 1');
    const userId = userResult.rows[0].id;
    console.log('Using user ID:', userId);
    
    // Create a test book
    console.log('Creating test book...');
    const bookData = {
      title: 'Test Book API',
      author: 'API Tester',
      traditions: ['Test'],
      description: 'Test book created via API',
      content: 'This is a test book content',
      year: 2025,
      language: 'english'
    };
    
    const createdBook = await bookService.createBook(bookData, userId);
    console.log('Book created:', createdBook.title);
    
    // Get all books
    console.log('Fetching all books...');
    const allBooks = await bookService.getAllBooksAdmin();
    console.log(`Found ${allBooks.total} books`);
    
    // Update the book
    console.log('Updating book...');
    const updatedBook = await bookService.updateBook(createdBook.id, {
      title: 'Updated Test Book API',
      description: 'Updated test book created via API'
    }, userId);
    console.log('Book updated:', updatedBook.title);
    
    // Delete the book (soft delete)
    console.log('Deleting book...');
    const deletedBook = await bookService.deleteBook(createdBook.id);
    console.log('Book deleted:', deletedBook.title);
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testBookAPI();