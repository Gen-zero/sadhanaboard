const db = require('../config/db');

async function fixNumericFields() {
  try {
    console.log('Fixing numeric fields for all books...');
    
    // Update all books to ensure numeric fields are properly set
    const result = await db.query(
      `UPDATE spiritual_books 
       SET file_size = CASE 
         WHEN file_size IS NOT NULL THEN file_size::bigint
         ELSE NULL
       END,
       year = CASE
         WHEN year IS NOT NULL THEN year::integer
         ELSE NULL
       END,
       page_count = CASE
         WHEN page_count IS NOT NULL THEN page_count::integer
         ELSE NULL
       END
       RETURNING id, title, file_size, year, page_count`
    );
    
    console.log(`Updated ${result.rowCount} books`);
    
    // Show the updated data
    result.rows.forEach(book => {
      console.log(`- ${book.title}: file_size=${book.file_size} (${typeof book.file_size}), year=${book.year}, page_count=${book.page_count}`);
    });
    
  } catch (error) {
    console.error('Error fixing numeric fields:', error);
  } finally {
    process.exit(0);
  }
}

fixNumericFields();