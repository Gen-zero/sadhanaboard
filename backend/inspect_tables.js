const { query } = require('./config/db');

async function inspectTables() {
  try {
    console.log('Inspecting database tables...');
    
    // Get detailed information about all tables
    const tablesResult = await query(`
      SELECT 
        t.table_name,
        t.table_type,
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default
      FROM information_schema.tables t
      LEFT JOIN information_schema.columns c 
        ON t.table_name = c.table_name 
        AND t.table_schema = c.table_schema
      WHERE t.table_schema = 'public'
      ORDER BY t.table_name, c.ordinal_position;
    `);
    
    // Group columns by table
    const tableInfo = {};
    tablesResult.rows.forEach(row => {
      const tableName = row.table_name;
      if (!tableInfo[tableName]) {
        tableInfo[tableName] = {
          tableType: row.table_type,
          columns: []
        };
      }
      
      if (row.column_name) {
        tableInfo[tableName].columns.push({
          name: row.column_name,
          type: row.data_type,
          nullable: row.is_nullable === 'YES',
          default: row.column_default
        });
      }
    });
    
    // Display information
    Object.keys(tableInfo).forEach(tableName => {
      const info = tableInfo[tableName];
      console.log(`\n${tableName} (${info.tableType.toLowerCase()})`);
      info.columns.forEach(col => {
        console.log(`  ${col.name} (${col.type})${col.nullable ? ' NULL' : ' NOT NULL'}${col.default ? ` DEFAULT ${col.default}` : ''}`);
      });
    });
    
    return tableInfo;
  } catch (error) {
    console.error('Error inspecting tables:', error.message);
    throw error;
  }
}

if (require.main === module) {
  inspectTables()
    .then(result => {
      console.log('\nTable inspection completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Table inspection failed:', error.message);
      process.exit(1);
    });
}

module.exports = { inspectTables };