require('dotenv').config();
const { Pool } = require('pg');

// Test database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'saadhanaboard',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 5432,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false
});

console.log('Testing database connection with configuration:');
console.log('- Host:', process.env.DB_HOST || 'localhost');
console.log('- Database:', process.env.DB_NAME || 'saadhanaboard');
console.log('- User:', process.env.DB_USER || 'postgres');
console.log('- Port:', process.env.DB_PORT || 5432);

async function testConnection() {
  try {
    console.log('Attempting to connect to database...');
    const client = await pool.connect();
    console.log('✅ Successfully connected to database!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database query successful:', result.rows[0]);
    
    // Test if important tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'profiles', 'spiritual_books', 'saadhanas')
      ORDER BY table_name;
    `);
    
    const existingTables = tablesResult.rows.map(row => row.table_name);
    console.log('✅ Existing important tables:', existingTables);
    
    client.release();
    await pool.end();
    console.log('✅ Connection test completed successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error details:', error);
  }
}

testConnection();