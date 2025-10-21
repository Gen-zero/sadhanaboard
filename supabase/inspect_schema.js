import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Traditional PostgreSQL configuration
const connectionString = process.env.DATABASE_URL || null;

const pool = new Pool(
  connectionString ? { 
    connectionString, 
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false 
  } : {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'saadhanaboard',
    password: process.env.DB_PASSWORD || 'root',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  }
);

async function inspectDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Test connection
    const testResult = await pool.query('SELECT NOW()');
    console.log('Database connected successfully!');
    
    // Get all tables
    console.log('\n--- TABLES ---');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log('Tables found:', tables);
    
    // Get schema for each table
    for (const table of tables) {
      console.log(`\n--- SCHEMA FOR ${table.toUpperCase()} ---`);
      
      // Get columns
      const columnsResult = await pool.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position
      `, [table]);
      
      console.log('Columns:');
      columnsResult.rows.forEach(row => {
        console.log(`  ${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
      });
      
      // Get constraints
      const constraintsResult = await pool.query(`
        SELECT 
          constraint_name,
          constraint_type
        FROM information_schema.table_constraints 
        WHERE table_name = $1
      `, [table]);
      
      if (constraintsResult.rows.length > 0) {
        console.log('Constraints:');
        constraintsResult.rows.forEach(row => {
          console.log(`  ${row.constraint_name} (${row.constraint_type})`);
        });
      }
      
      // Get indexes
      const indexesResult = await pool.query(`
        SELECT 
          indexname,
          indexdef
        FROM pg_indexes 
        WHERE tablename = $1
      `, [table]);
      
      if (indexesResult.rows.length > 0) {
        console.log('Indexes:');
        indexesResult.rows.forEach(row => {
          console.log(`  ${row.indexname}: ${row.indexdef}`);
        });
      }
    }
    
    // Get extensions
    console.log('\n--- EXTENSIONS ---');
    const extensionsResult = await pool.query(`
      SELECT extname 
      FROM pg_extension
    `);
    
    console.log('Extensions:');
    extensionsResult.rows.forEach(row => {
      console.log(`  ${row.extname}`);
    });
    
  } catch (error) {
    console.error('Error inspecting database:', error);
  } finally {
    await pool.end();
  }
}

inspectDatabase();