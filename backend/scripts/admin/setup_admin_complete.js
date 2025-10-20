/**
 * setup_admin_complete.js
 * Runs the admin migration (if required), creates a default admin, and verifies setup.
 * Usage: node backend/scripts/setup_admin_complete.js
 */
require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');
const db = require('../config/db');
const adminAuthService = require('../services/adminAuthService');
const fs = require('fs');

async function tableExists() {
  const r = await db.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='admin_details')");
  return r.rows[0] && r.rows[0].exists;
}

async function applyMigrationIfNeeded() {
  const exists = await tableExists();
  if (exists) {
    console.log('admin_details already present; skipping migration.');
    return;
  }
  console.log('Applying migration to create admin_details...');
  const script = path.join(__dirname, 'apply_admin_migration.js');
  execSync(`node "${script}"`, { stdio: 'inherit' });
}

async function createDefaultAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const email = process.env.ADMIN_EMAIL || 'admin@saadhanaboard.com';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const force = process.env.ADMIN_FORCE_UPDATE === '1' || false;

  const existing = await adminAuthService.getAdminByUsername(username);
  if (existing && !force) {
    console.log('Default admin already exists:', existing.username);
    return existing;
  }
  if (existing && force) {
    console.log('Force updating existing admin password...');
    // create a new one by removing and recreating (simple strategy)
    await db.query('DELETE FROM admin_details WHERE id = $1', [existing.id]);
  }
  console.log('Creating default admin:', username);
  const admin = await adminAuthService.register({ username, email, password, role: 'superadmin', created_by: null });
  console.log('Created admin id=', admin.id);
  return admin;
}

async function verifyBasicLogin(admin, password) {
  try {
    const { token } = await adminAuthService.login({ usernameOrEmail: admin.username, password });
    console.log('Login test: OK, token length=', token.length);
  } catch (e) {
    console.error('Login test failed:', e.message || e);
    process.exit(6);
  }
}

(async () => {
  try {
    console.log('== Admin Setup Complete ==');
    // 1) DB connectivity
    try {
      await db.query('SELECT NOW()');
      console.log('[DB] connection: OK');
    } catch (e) {
      console.error('[DB] connection failed:', e.message);
      process.exit(2);
    }

    // 2) migration
    await applyMigrationIfNeeded();

    // 3) create admin
    const admin = await createDefaultAdmin();

    // 4) verify login
    await verifyBasicLogin(admin, process.env.ADMIN_PASSWORD || 'ChangeMe123!');

    console.log('== Setup complete ==');
    process.exit(0);
  } catch (err) {
    console.error('setup_admin_complete failed:', err && err.message ? err.message : err);
    process.exit(99);
  }
})();
