/**
 * createDemoUser.js - utility script to create a demo user
 * Usage: node backend/scripts/createDemoUser.js
 */
require('dotenv').config({ path: __dirname + '/../.env' });

const bcrypt = require('bcrypt');
const { query } = require('../config/db');

async function createDemoUser() {
  try {
    // Demo user credentials
    const username = 'Ritesh';
    const email = 'ritesh@example.com';
    const password = 'Ritesh@123';
    
    console.log('Creating demo user with credentials:');
    console.log('- Username:', username);
    console.log('- Email:', email);
    console.log('- Password:', password);
    
    // Check if user already exists
    const existingUsersResult = await query(
      'SELECT id FROM users WHERE email = $1 OR display_name = $2',
      [email, username]
    );
      
    if (existingUsersResult.rows.length > 0) {
      console.log('User already exists with email or username');
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userResult = await query(
      `INSERT INTO users (email, password, display_name, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       RETURNING id, email, display_name, created_at`,
      [email, hashedPassword, username]
    );
    
    const user = userResult.rows[0];
    console.log('User created successfully:', user);

    // Create profile
    const profileResult = await query(
      `INSERT INTO profiles (id, display_name, created_at, updated_at) 
       VALUES ($1, $2, NOW(), NOW())`,
      [user.id, username]
    );
    
    console.log('Profile created successfully for user:', user.display_name);

  } catch (error) {
    console.error('Error creating demo user:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

if (require.main === module) {
  createDemoUser();
}