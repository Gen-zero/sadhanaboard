/**
 * verifyDemoUser.js - utility script to verify the demo user was created
 * Usage: node backend/scripts/verifyDemoUser.js
 */
require('dotenv').config({ path: __dirname + '/../.env' });

// Also load production env if exists
require('dotenv').config({ path: __dirname + '/../.env.production', override: true });

const { query } = require('../config/db');

async function verifyDemoUser() {
  try {
    // Check if user exists
    const usersResult = await query(
      `SELECT id, email, display_name, created_at 
       FROM users 
       WHERE display_name = $1`,
      ['Ritesh']
    );
      
    if (usersResult.rows.length === 0) {
      console.log('No user found with username Ritesh');
      return;
    }
    
    const user = usersResult.rows[0];
    console.log('Found user:');
    console.log('- ID:', user.id);
    console.log('- Email:', user.email);
    console.log('- Display Name:', user.display_name);
    console.log('- Created At:', user.created_at);
    
    // Check if profile exists
    const profilesResult = await query(
      `SELECT id, display_name 
       FROM profiles 
       WHERE id = $1`,
      [user.id]
    );
      
    if (profilesResult.rows.length === 0) {
      console.log('No profile found for user');
      return;
    }
    
    const profile = profilesResult.rows[0];
    console.log('Profile found:');
    console.log('- ID:', profile.id);
    console.log('- Display Name:', profile.display_name);
    
    console.log('\n✅ Demo user verification successful!');

  } catch (error) {
    console.error('Error verifying demo user:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

if (require.main === module) {
  verifyDemoUser();
}