/**
 * fix_admin_setup.js
 * Ensures admin_details table exists and demo admin account is created or repaired.
 * Usage: node backend/scripts/fix_admin_setup.js --force-reset
 */
require('dotenv').config();
const db = require('../config/db');
const Admin = require('../models/Admin');
const adminAuthService = require('../services/adminAuthService');
const bcrypt = require('bcrypt');
const fs = require('fs');

async function tableExists(name) {
  const r = await db.query(`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1)`, [name]);
  return r.rows[0] && r.rows[0].exists;
}

async function createTableIfMissing() {
  const has = await tableExists('admin_details');
  if (has) return false;
  console.log('[DB] admin_details missing, creating minimal schema...');
  // Minimal migration: create basic columns (non-destructive)
  const sql = `
    CREATE TABLE IF NOT EXISTS admin_details (
      id SERIAL PRIMARY KEY,
      username VARCHAR(150) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE,
      password_hash TEXT NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      active BOOLEAN DEFAULT TRUE,
      last_login TIMESTAMP NULL,
      login_attempts INTEGER DEFAULT 0,
      locked_until TIMESTAMP NULL,
      created_by INTEGER NULL,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `;
  await db.query(sql);
  console.log('[DB] admin_details created');
  return true;
}

async function run() {
  try {
    await db.query('SELECT 1');
    console.log('[DB] connection OK');

    await createTableIfMissing();

    const demoUser = 'KaliVaibhav';
    const demoPass = 'Subham@98';
    const r = await db.query('SELECT * FROM admin_details WHERE username = $1', [demoUser]);
    if (r.rows && r.rows.length) {
      console.log('[DB] demo admin already exists:', r.rows[0].username);
      const force = process.argv.includes('--force-reset');
      if (force) {
        const hash = await bcrypt.hash(demoPass, 10);
        await db.query('UPDATE admin_details SET password_hash = $1, active = true, locked_until = NULL, login_attempts = 0 WHERE username = $2', [hash, demoUser]);
        console.log('[SEC] demo admin password reset via --force-reset');
      }
      process.exit(0);
    }

    // create demo admin
    const hash = await bcrypt.hash(demoPass, 10);
    const insert = await db.query('INSERT INTO admin_details (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username', [demoUser, 'kali@example.com', hash, 'superadmin']);
    console.log('[DB] demo admin created:', insert.rows[0].username, 'id=', insert.rows[0].id);
    process.exit(0);
  } catch (err) {
    console.error('fix_admin_setup failed:', err && err.message ? err.message : err);
    process.exit(10);
  }
}

if (require.main === module) run();
