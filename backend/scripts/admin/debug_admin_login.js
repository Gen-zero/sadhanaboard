/**
 * debug_admin_login.js
 * Comprehensive debug utility to test the admin login stack end-to-end.
 * Usage: node backend/scripts/debug_admin_login.js
 */
const path = require('path');
// Fix the path resolution for running from different directories
const basePath = path.resolve(__dirname, '..', '..');
require('dotenv').config({ path: path.join(basePath, '.env') });
const db = require('../../config/db');
const Admin = require('../../models/Admin');
const adminAuthService = require('../../services/adminAuthService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let fetch = global.fetch;
const util = require('util');

function showPoolStats() {
  try {
    console.log('[POOL] totalCount:', db.totalCount());
    console.log('[POOL] idleCount :', db.idleCount());
    console.log('[POOL] waitingCount :', db.waitingCount());
  } catch (e) {
    // ignore
  }
}

async function ensureFetch() {
  if (fetch) return fetch;
  try {
    // dynamic import to avoid hard dependency; works on Node 14+ if installed
    const nf = await import('node-fetch');
    fetch = nf.default || nf;
    return fetch;
  } catch (e) {
    throw new Error('fetch not available - please run on Node 18+ or install node-fetch in the backend');
  }
}

async function tableExists(name) {
  const r = await db.query(`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1)`, [name]);
  return r.rows[0] && r.rows[0].exists;
}

async function run() {
  console.log('== Admin Login Debugger ==');
  try {
    // 1) DB connection
    try {
      await db.query('SELECT NOW()');
      console.log('[DB] connection: OK');
    } catch (e) {
      console.error('[DB] connection: FAILED -', e.message);
      return process.exit(20);
    }

    // 2) table exists
    const hasTable = await tableExists('admin_details');
    console.log('[DB] admin_details table:', hasTable ? 'FOUND' : 'MISSING');

    // show pool stats
    showPoolStats();

    // 2b) if present show basic schema columns
    if (hasTable) {
      try {
        const cols = await db.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'admin_details' ORDER BY ordinal_position`);
        console.log('[DB] admin_details columns:');
        cols.rows.forEach(r => console.log('  -', r.column_name, r.data_type));
      } catch (e) {
        console.warn('[DB] failed to list columns:', e.message);
      }
    }

    // 3) check demo user
    const demoUser = 'KaliVaibhav';
    const demoPass = 'Subham@98';
    let adminRecord = null;
    if (hasTable) {
      adminRecord = await Admin.findByUsername(demoUser);
      console.log('[DB] demo account:', adminRecord ? `FOUND (id=${adminRecord.id})` : 'NOT FOUND');
    }

    // 4) password compare if found + lock status
    if (adminRecord) {
      const ok = await bcrypt.compare(demoPass, adminRecord.password_hash);
      console.log('[SEC] demo password match:', ok ? 'YES' : 'NO');
      console.log('[SEC] account locked_until:', adminRecord.locked_until, 'login_attempts:', adminRecord.login_attempts);
      if (adminRecord.locked_until && new Date(adminRecord.locked_until) > new Date()) {
        const rem = Math.ceil((new Date(adminRecord.locked_until) - new Date()) / 60000);
        console.log(`[SEC] account is LOCKED - remaining minutes: ${rem}`);
      }
    }

    // 5) JWT signing test
    const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret';
    try {
      const token = jwt.sign({ test: true, timestamp: Date.now() }, jwtSecret, { expiresIn: '1h' });
      const decoded = jwt.verify(token, jwtSecret);
      console.log('[JWT] sign/verify: OK');
    } catch (e) {
      console.error('[JWT] sign/verify: FAILED -', e.message);
    }

    // 6) Test adminAuthService.login directly (if user exists)
    if (adminRecord) {
      try {
        const { token, admin } = await adminAuthService.login({ usernameOrEmail: demoUser, password: demoPass });
        console.log('[SERVICE] direct login: OK, token length=', token ? token.length : 0);
      } catch (e) {
        // if account locked provide details
        if (e && e.message === 'account_locked') {
          console.error('[SERVICE] direct login: ACCOUNT LOCKED - details:', e.details || e.message);
        } else {
          console.error('[SERVICE] direct login: FAILED -', e.message || e);
        }
      }
    }

    // 7) Test /api/admin/login endpoint (if server running)
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3004}`;
    const endpoint = `${backendUrl.replace(/\/$/, '')}/api/admin/login`;
    console.log('[HTTP] testing endpoint:', endpoint);
    try {
      const _fetch = await ensureFetch();
      const resp = await _fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ usernameOrEmail: demoUser, password: demoPass }),
        // don't follow redirects to simplify output
      });
      const text = await resp.text();
      console.log('[HTTP] status=', resp.status);
      try { console.log('[HTTP] body=', JSON.parse(text)); } catch (e) { console.log('[HTTP] body(raw)=', text); }
    } catch (e) {
      console.error('[HTTP] endpoint test failed:', e.message);
    }

    // 8) environment vars
    console.log('[ENV] JWT_SECRET set:', !!process.env.JWT_SECRET);
    console.log('[ENV] DATABASE_URL set:', !!process.env.DATABASE_URL);
    console.log('[ENV] CORS_ORIGIN / CORS_ORIGINS:', process.env.CORS_ORIGIN || process.env.CORS_ORIGINS);

    // optional unlock flag
    const args = process.argv.slice(2);
    const wantUnlock = args.includes('--unlock');
    if (wantUnlock && adminRecord) {
      console.log('[DEBUG] --unlock flag detected, attempting to unlock demo account...');
      try {
        const unlocked = await adminAuthService.unlockAccount(demoUser);
        console.log('[DEBUG] unlock result:', unlocked ? `unlocked id=${unlocked.id}` : 'failed');
      } catch (e) {
        console.error('[DEBUG] unlock failed:', e && e.message ? e.message : e);
      }
    }

    console.log('== Debug complete ==');
    process.exit(0);
  } catch (err) {
    console.error('debug_admin_login failed:', err && err.message ? err.message : err);
    process.exit(99);
  }
}

if (require.main === module) run();
