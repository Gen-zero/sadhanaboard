/**
 * verify_admin_setup.js
 * Runs a set of verification tests for the admin authentication stack.
 * Usage: node backend/scripts/verify_admin_setup.js
 */
require('dotenv').config();
const db = require('../config/db');
const Admin = require('../models/Admin');
const adminAuthService = require('../services/adminAuthService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function tableExists() {
  const r = await db.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='admin_details')");
  return r.rows[0] && r.rows[0].exists;
}

(async () => {
  try {
    console.log('== Admin Verification ==');
    // DB
    try {
      await db.query('SELECT NOW()');
      console.log('[DB] connection OK');
    } catch (e) {
      console.error('[DB] connection FAILED:', e.message);
      return process.exit(10);
    }

    const exists = await tableExists();
    if (!exists) {
      console.error('[DB] admin_details missing');
      return process.exit(11);
    }
    console.log('[DB] admin_details found');

    const admin = await Admin.findByUsername(process.env.ADMIN_USERNAME || 'admin');
    if (!admin) {
      console.warn('[VERIFY] No default admin found for username', process.env.ADMIN_USERNAME || 'admin');
    } else {
      console.log('[VERIFY] Found admin id=', admin.id);
      // password hashing test
      const pw = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
      const ok = await bcrypt.compare(pw, admin.password_hash);
      console.log('[VERIFY] password hash compare:', ok ? 'OK' : 'FAILED');
      // jwt test
      try {
        const token = jwt.sign({ sub: admin.id, admin: true }, process.env.JWT_SECRET || 'dev_jwt_secret');
        const decoded = adminAuthService.verifyToken(token);
        console.log('[VERIFY] JWT verify: OK');
      } catch (e) {
        console.error('[VERIFY] JWT verify failed:', e.message || e);
      }
    }

    // service layer tests
    try {
      const methods = ['getAdminById', 'getAdminByUsername'];
      for (const m of methods) {
        if (typeof adminAuthService[m] !== 'function') {
          console.warn('[VERIFY] adminAuthService missing method:', m);
        } else {
          console.log('[VERIFY] adminAuthService has method:', m);
        }
      }
    } catch (e) {
      // ignore
    }

    console.log('== Verification complete ==');
    process.exit(0);
  } catch (err) {
    console.error('verify_admin_setup failed:', err && err.message ? err.message : err);
    process.exit(99);
  }
})();
