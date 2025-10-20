#!/usr/bin/env node
require('dotenv').config();
const Admin = require('../models/Admin');
const db = require('../config/db');
const bcrypt = require('bcrypt');

async function usage() {
  console.log('Usage: node backend/scripts/admin_account_manager.js <command> [args]');
  console.log('Commands:');
  console.log('  status <username>        Show detailed account status');
  console.log('  unlock <username>        Unlock specified account');
  console.log('  lock <username> [mins]   Lock account for minutes (default from env)');
  console.log('  list                     List all admin accounts');
  console.log('  reset-password <username> <new_password>  Reset password for username');
  process.exit(1);
}

async function status(username) {
  if (!username) return usage();
  const info = await require('../services/adminAuthService').getAccountStatus(username);
  if (!info) return console.log('Account not found');
  console.log('Account status:', info);
}

async function list() {
  const res = await db.query('SELECT id, username, email, role, active, login_attempts, locked_until, last_login FROM admin_details ORDER BY username');
  res.rows.forEach(r => {
    console.log(`${r.username} | active=${r.active} | locked_until=${r.locked_until} | attempts=${r.login_attempts} | last_login=${r.last_login}`);
  });
}

async function unlock(username) {
  if (!username) return usage();
  try {
    const updated = await require('../services/adminAuthService').unlockAccount(username);
    if (updated) console.log('Unlocked:', updated.username, 'id=', updated.id);
    else console.log('Unlock failed or no change');
  } catch (e) {
    console.error('unlock error:', e && e.message ? e.message : e);
  }
}

async function lock(username, minutesArg) {
  if (!username) return usage();
  const minutes = minutesArg ? Number(minutesArg) : (process.env.ADMIN_LOCK_MINUTES ? Number(process.env.ADMIN_LOCK_MINUTES) : 30);
  const until = new Date(Date.now() + minutes * 60 * 1000);
  try {
    const admin = await Admin.findByUsername(username);
    if (!admin) return console.log('Not found');
    await Admin.lockUntil(admin.id, until);
    console.log(`Locked ${username} until ${until.toISOString()}`);
  } catch (e) {
    console.error('lock error:', e && e.message ? e.message : e);
  }
}

async function resetPassword(username, newPass) {
  if (!username || !newPass) return usage();
  try {
    const admin = await Admin.findByUsername(username);
    if (!admin) return console.log('Not found');
    const hash = await bcrypt.hash(newPass, 10);
    await db.query('UPDATE admin_details SET password_hash = $2, login_attempts = 0, locked_until = NULL, updated_at = now() WHERE id = $1', [admin.id, hash]);
    console.log('Password reset for', username);
  } catch (e) {
    console.error('resetPassword error:', e && e.message ? e.message : e);
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const cmd = argv[0];
  if (!cmd) return usage();
  if (cmd === 'status') return status(argv[1]);
  if (cmd === 'unlock') return unlock(argv[1]);
  if (cmd === 'lock') return lock(argv[1], argv[2]);
  if (cmd === 'list') return list();
  if (cmd === 'reset-password') return resetPassword(argv[1], argv[2]);
  return usage();
}

if (require.main === module) main();
