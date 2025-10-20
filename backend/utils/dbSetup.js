const { Client } = require('pg');

async function setupDatabase() {
  // First, try to connect with default 'postgres' password
  const client1 = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'postgres',
    port: 5432,
  });

  try {
    await client1.connect();
    console.log('Connected to PostgreSQL with password "postgres"');
    
    // Check if database exists
    const res = await client1.query(
      "SELECT 1 FROM pg_database WHERE datname = 'saadhanaboard'"
    );
    
    if (res.rowCount === 0) {
      // Database doesn't exist, create it
      await client1.query('CREATE DATABASE saadhanaboard');
      console.log('Database "saadhanaboard" created successfully');
    } else {
      console.log('Database "saadhanaboard" already exists');
    }
    
    await client1.end();
    return;
  } catch (err) {
    console.log('Failed to connect with password "postgres":', err.message);
  }

  // If that fails, try with 'root' password
  const client2 = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'root',
    port: 5432,
  });

  try {
    await client2.connect();
    console.log('Connected to PostgreSQL with password "root"');
    
    // Check if database exists
    const res = await client2.query(
      "SELECT 1 FROM pg_database WHERE datname = 'saadhanaboard'"
    );
    
    if (res.rowCount === 0) {
      // Database doesn't exist, create it
      await client2.query('CREATE DATABASE saadhanaboard');
      console.log('Database "saadhanaboard" created successfully');
    } else {
      console.log('Database "saadhanaboard" already exists');
    }
    
    await client2.end();
    return;
  } catch (err) {
    console.log('Failed to connect with password "root":', err.message);
  }

  console.log('Could not connect to PostgreSQL with either password. Please check your PostgreSQL installation and credentials.');
}

setupDatabase();