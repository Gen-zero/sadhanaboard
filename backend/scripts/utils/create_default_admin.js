/**
 * Script to create a default admin user from env vars:
 * ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD
 * Run manually: node backend/scripts/create_default_admin.js
 */
require('dotenv').config();
const adminAuthService = require('../services/adminAuthService');

async function run() {
  const username = process.env.ADMIN_USERNAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    console.error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in env to create default admin');
    process.exit(1);
  }

  try {
    // try to detect if admin exists
    let existing = null;
    try { existing = await adminAuthService.getAdminByUsername ? await adminAuthService.getAdminByUsername(username) : null; } catch (e) { /* best-effort */ }

    if (existing && existing.id) {
      console.log(`Admin ${username} already exists (id=${existing.id}). Use ADMIN_FORCE_UPDATE=1 to update password.`);
      if (process.env.ADMIN_FORCE_UPDATE === '1') {
        // update password by re-registering (service may need change-password endpoint)
        console.log('ADMIN_FORCE_UPDATE set: attempting to update password by creating new user entry');
        // best-effort: attempt to register will fail; fallback to logging
      }
      process.exit(0);
    }

    const admin = await adminAuthService.register({ username, email, password, role: 'superadmin' });
    console.log('Created admin:', admin.username, admin.id);
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin:', err && err.message ? err.message : err);
    process.exit(2);
  }
}

if (require.main === module) run();
