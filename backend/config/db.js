const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || null;

const pool = new Pool(
  connectionString ? { connectionString, ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false } : {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'saadhanaboard',
    password: process.env.DB_PASSWORD || 'root',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  }
);

// Best-effort connection test (non-blocking)
pool.query('SELECT NOW()').then(() => {
  console.log('Database connected');
}).catch((err) => {
  console.warn('Database connection test failed (this may be expected in some dev environments):', err.message);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
  totalCount: () => (pool.totalCount !== undefined ? pool.totalCount : null),
  idleCount: () => (pool.idleCount !== undefined ? pool.idleCount : null),
  waitingCount: () => (pool.waitingCount !== undefined ? pool.waitingCount : null),
};