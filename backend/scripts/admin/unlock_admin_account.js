#!/usr/bin/env node
require('dotenv').config();
const db = require('../config/db');
const Admin = require('../models/Admin');

async function unlock(username) {
  if (!username) {
    console.error('Usage: node backend/scripts/unlock_admin_account.js <username>');
    process.exit(2);
  }
  try {
    const admin = await Admin.findByUsername(username);
    if (!admin) {
      console.error('Admin not found:', username);
      return process.exit(3);
    }
    console.log('Current status for', username, '-> locked_until:', admin.locked_until, 'login_attempts:', admin.login_attempts);
    if (!admin.locked_until || new Date(admin.locked_until) <= new Date()) {
      console.log('Account is not currently locked. No action taken.');
      return process.exit(0);
    }
    // perform unlock
    const res = await db.query('UPDATE admin_details SET locked_until = NULL, login_attempts = 0, updated_at = now() WHERE id = $1 RETURNING *', [admin.id]);
    if (!res || !res.rows || res.rows.length === 0) {
      console.error('Failed to update admin record');
      return process.exit(4);
    }
    const updated = res.rows[0];
    console.log('Unlocked account. New status -> locked_until:', updated.locked_until, 'login_attempts:', updated.login_attempts);
    // verify by loading via model
    const verify = await Admin.findById(admin.id);
    console.log('Verify via model -> locked_until:', verify.locked_until, 'login_attempts:', verify.login_attempts);
    console.log('Done. You can attempt to login now.');
    process.exit(0);
  } catch (err) {
    console.error('unlock_admin_account error:', err && err.message ? err.message : err);
    process.exit(10);
  }
}

if (require.main === module) {
  const username = process.argv[2];
  unlock(username);
}
