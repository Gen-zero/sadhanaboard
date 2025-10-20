/**
 * setup_admin.js - utility script to check admin tables and create a demo admin
 * Usage: node backend/scripts/setup_admin.js
 */
require('dotenv').config({ path: __dirname + '/../../.env' });
const db = require('../../config/db');
const adminAuthService = require('../../services/adminAuthService');
const fs = require('fs');

async function tableExists(name) {
  const r = await db.query(`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1)`, [name]);
  return r.rows[0] && r.rows[0].exists;
}

async function run() {
  try {
    // quick connection test
    await db.query('SELECT 1');
    console.log('DB connection OK');

    const adminTable = await tableExists('admin_details');
    if (!adminTable) {
      console.error('admin_details table not found. Please run migrations or create the table first.');
      process.exit(1);
    }

    // check if any admin exists
    const r = await db.query('SELECT id, username FROM admin_details LIMIT 1');
    if (r.rows && r.rows.length) {
      console.log('Existing admin account(s) found. Example:', r.rows[0]);
      process.exit(0);
    }

    // if none, create demo admin (same credentials as create_demo_admin)
    const demoUser = 'KaliVaibhav';
    const demoPass = 'Subham@98';
    try {
      const admin = await adminAuthService.register({ username: demoUser, email: 'kali@example.com', password: demoPass, role: 'superadmin' });
      console.log('Demo admin created:', admin.username, admin.id);
      process.exit(0);
    } catch (err) {
      console.error('Failed to create demo admin:', err && err.message ? err.message : err);
      process.exit(2);
    }

  } catch (err) {
    console.error('setup_admin failed:', err && err.message ? err.message : err);
    process.exit(3);
  }
}

if (require.main === module) run();
