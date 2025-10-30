const { query } = require('./config/db');

async function checkTables() {
  try {
    console.log('Checking database tables...');
    
    // Check if users table exists and get row count
    const usersResult = await query(`
      SELECT 
        EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'users'
        ) as exists,
        (SELECT count(*) FROM users) as count
      WHERE EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    const usersInfo = usersResult.rows[0] || { exists: false, count: 0 };
    console.log('Users table:', usersInfo.exists ? `✓ (${usersInfo.count} rows)` : '✗');
    
    // Check if profiles table exists and get row count
    const profilesResult = await query(`
      SELECT 
        EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'profiles'
        ) as exists,
        (SELECT count(*) FROM profiles) as count
      WHERE EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'profiles'
      );
    `);
    
    const profilesInfo = profilesResult.rows[0] || { exists: false, count: 0 };
    console.log('Profiles table:', profilesInfo.exists ? `✓ (${profilesInfo.count} rows)` : '✗');
    
    // Check if spiritual_books table exists and get row count
    const booksResult = await query(`
      SELECT 
        EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'spiritual_books'
        ) as exists,
        (SELECT count(*) FROM spiritual_books) as count
      WHERE EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'spiritual_books'
      );
    `);
    
    const booksInfo = booksResult.rows[0] || { exists: false, count: 0 };
    console.log('Spiritual books table:', booksInfo.exists ? `✓ (${booksInfo.count} rows)` : '✗');
    
    // Check if saadhanas table exists and get row count
    const sadhanasResult = await query(`
      SELECT 
        EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'saadhanas'
        ) as exists,
        (SELECT count(*) FROM saadhanas) as count
      WHERE EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'saadhanas'
      );
    `);
    
    const sadhanasInfo = sadhanasResult.rows[0] || { exists: false, count: 0 };
    console.log('Saadhanas table:', sadhanasInfo.exists ? `✓ (${sadhanasInfo.count} rows)` : '✗');
    
    return {
      users: usersInfo,
      profiles: profilesInfo,
      books: booksInfo,
      sadhanas: sadhanasInfo
    };
  } catch (error) {
    console.error('Error checking tables:', error.message);
    // Return default values if tables don't exist yet
    return {
      users: { exists: false, count: 0 },
      profiles: { exists: false, count: 0 },
      books: { exists: false, count: 0 },
      sadhanas: { exists: false, count: 0 }
    };
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