const { query } = require('./config/db');

async function checkDatabaseStructure() {
  try {
    console.log('Checking database structure...');
    
    // Get database version
    const versionResult = await query('SELECT version();');
    console.log('Database version:', versionResult.rows[0].version);
    
    // Get list of schemas
    const schemasResult = await query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT LIKE 'pg_%' 
      AND schema_name != 'information_schema'
      ORDER BY schema_name;
    `);
    
    const schemas = schemasResult.rows.map(row => row.schema_name);
    console.log('Found schemas:', schemas);
    
    // Get list of tables in public schema
    const tablesResult = await query(`
      SELECT table_name, table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    const tables = tablesResult.rows;
    console.log('Tables in public schema:');
    tables.forEach(table => {
      console.log(`  ${table.table_name} (${table.table_type.toLowerCase()})`);
    });
    
    // Get list of views
    const viewsResult = await query(`
      SELECT table_name
      FROM information_schema.views 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    const views = viewsResult.rows.map(row => row.table_name);
    if (views.length > 0) {
      console.log('Views in public schema:', views);
    }
    
    return {
      version: versionResult.rows[0].version,
      schemas,
      tables: tables.map(t => ({ name: t.table_name, type: t.table_type })),
      views
    };
  } catch (error) {
    console.error('Error checking database structure:', error.message);
    throw error;
  }
}

if (require.main === module) {
  checkDatabaseStructure()
    .then(result => {
      console.log('Database structure check completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Database structure check failed:', error.message);
      process.exit(1);
    });
}

module.exports = { checkDatabaseStructure };