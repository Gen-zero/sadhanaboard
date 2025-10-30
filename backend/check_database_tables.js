const { query } = require('./config/db');

async function checkTables() {
  try {
    console.log('Checking database tables...');
    
    // Check if users table exists
    const usersResult = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    const usersTableExists = usersResult.rows[0].exists;
    console.log('Users table exists:', usersTableExists);
    
    // Check if profiles table exists
    const profilesResult = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'profiles'
      );
    `);
    
    const profilesTableExists = profilesResult.rows[0].exists;
    console.log('Profiles table exists:', profilesTableExists);
    
    // Check if spiritual_books table exists
    const booksResult = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'spiritual_books'
      );
    `);
    
    const booksTableExists = booksResult.rows[0].exists;
    console.log('Spiritual books table exists:', booksTableExists);
    
    // Check if sadhanas table exists
    const sadhanasResult = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'saadhanas'
      );
    `);
    
    const sadhanasTableExists = sadhanasResult.rows[0].exists;
    console.log('Saadhanas table exists:', sadhanasTableExists);
    
    return {
      users: usersTableExists,
      profiles: profilesTableExists,
      books: booksTableExists,
      sadhanas: sadhanasTableExists
    };
  } catch (error) {
    console.error('Error checking tables:', error.message);
    throw error;
  }
}

if (require.main === module) {
  checkTables()
    .then(result => {
      console.log('Table check completed:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Table check failed:', error.message);
      process.exit(1);
    });
}

module.exports = { checkTables };