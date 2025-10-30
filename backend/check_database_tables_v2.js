const { query } = require('./config/db');

async function checkTablesV2() {
  try {
    console.log('Checking database tables (v2)...');
    
    // Get list of all tables
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log('Found tables:', tables);
    
    // Check specific tables we care about
    const importantTables = [
      'users',
      'profiles',
      'spiritual_books',
      'saadhanas',
      'sadhana_entries',
      'groups',
      'group_members',
      'community_posts'
    ];
    
    const tableStatus = {};
    for (const tableName of importantTables) {
      const exists = tables.includes(tableName);
      tableStatus[tableName] = exists;
      console.log(`${tableName}: ${exists ? '✓' : '✗'}`);
    }
    
    return {
      allTables: tables,
      importantTables: tableStatus
    };
  } catch (error) {
    console.error('Error checking tables:', error.message);
    throw error;
  }
}

if (require.main === module) {
  checkTablesV2()
    .then(result => {
      console.log('Table check completed:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Table check failed:', error.message);
      process.exit(1);
    });
}

module.exports = { checkTablesV2 };