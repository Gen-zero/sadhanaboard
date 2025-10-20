const db = require('../config/db');

async function fixDateFields() {
  try {
    console.log('Fixing date fields for all books...');
    
    // Update all books to ensure date fields are properly formatted
    const result = await db.query(
      `UPDATE spiritual_books 
       SET created_at = CASE 
         WHEN created_at IS NOT NULL THEN created_at::timestamptz
         ELSE NOW()
       END,
       updated_at = CASE
         WHEN updated_at IS NOT NULL THEN updated_at::timestamptz
         ELSE NOW()
       END
       RETURNING id, title, created_at, updated_at`
    );
    
    console.log(`Updated ${result.rowCount} books`);
    
    // Show the updated data
    result.rows.forEach(book => {
      console.log(`- ${book.title}: created_at=${book.created_at} (${typeof book.created_at}), updated_at=${book.updated_at} (${typeof book.updated_at})`);
    });
    
  } catch (error) {
    console.error('Error fixing date fields:', error);
  } finally {
    process.exit(0);
  }
}

fixDateFields();