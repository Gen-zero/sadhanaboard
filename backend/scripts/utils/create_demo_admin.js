/**
 * Demo admin creation script (non-interactive)
 * Creates an admin with username 'KaliVaibhav' and password 'Subham@98'
 * Run: node backend/scripts/create_demo_admin.js
 */
require('dotenv').config();
const adminAuthService = require('../services/adminAuthService');

async function run() {
  const username = 'KaliVaibhav';
  const password = 'Subham@98';
  const email = process.env.DEMO_ADMIN_EMAIL || 'kali@example.com';
  try {
    // Check if already exists
    const existing = await adminAuthService.getAdminByUsername ? await adminAuthService.getAdminByUsername(username) : null;
    if (existing && existing.id) {
      console.log('Demo admin already exists:', existing.username, existing.id);
      process.exit(0);
    }
    const admin = await adminAuthService.register({ username, email, password, role: 'superadmin' });
    console.log('Demo admin created:', admin.username, admin.id);
    process.exit(0);
  } catch (err) {
    if (err && err.message === 'username_taken') {
      console.log('Admin username already taken');
      process.exit(0);
    }
    console.error('Failed to create demo admin:', err && err.message ? err.message : err);
    process.exit(2);
  }
}

if (require.main === module) run();
