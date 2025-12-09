#!/usr/bin/env node

/**
 * updateUserPassword.js - Utility script to update a user's password in MongoDB
 * Usage: node backend/scripts/updateUserPassword.js --email <email> --password <new_password>
 * 
 * This script updates a user's password with bcrypt hashing.
 */

require('dotenv').config({ path: __dirname + '/../.env.development' });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import User schema
const User = require('../schemas/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://subham4343_db_user:RsD0qysfLKGeX3GL@cluster1.mn2ty8w.mongodb.net/?appName=Cluster1';

// Parse command line arguments
const args = process.argv.slice(2);
const email = args[args.indexOf('--email') + 1];
const password = args[args.indexOf('--password') + 1];

if (!email || !password) {
  console.log('❌ Missing required arguments\n');
  console.log('Usage: node updateUserPassword.js --email <email> --password <new_password>\n');
  console.log('Example:');
  console.log('  node updateUserPassword.js --email suhanisaxena0107@gmail.com --password Suhani@123');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('❌ Invalid email format');
  process.exit(1);
}

// Validate password strength
if (password.length < 6) {
  console.error('❌ Password must be at least 6 characters long');
  process.exit(1);
}

async function updateUserPassword() {
  let connection = null;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Connect to MongoDB
    connection = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: 'majority',
      appName: 'SaadhanaBoard'
    });
    
    console.log('✓ MongoDB connected successfully\n');

    console.log('📝 Update Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:       ${email}`);
    console.log(`New Password: ${password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check if user exists
    console.log('🔍 Checking if user exists...');
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (!existingUser) {
      console.log('❌ User not found!');
      return;
    }

    console.log(`Found user: ${existingUser.displayName} (${existingUser.email})`);

    // Hash the new password
    console.log('🔐 Hashing new password...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password
    console.log('✍️  Updating user password...');
    await User.findByIdAndUpdate(existingUser._id, {
      password: hashedPassword,
      updatedAt: new Date()
    });

    console.log('\n✅ User password updated successfully!\n');
    console.log('📊 User Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`User ID:     ${existingUser._id}`);
    console.log(`Email:       ${existingUser.email}`);
    console.log(`Display:     ${existingUser.displayName}`);
    console.log(`Status:      ${existingUser.status}`);
    console.log(`Updated:     ${new Date().toISOString()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🔐 Login with:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:       ${email}`);
    console.log(`Password:    ${password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✨ User password updated successfully!');

  } catch (error) {
    console.error('❌ Error updating user password:');
    console.error(`   ${error.message}\n`);
    
    process.exit(1);
  } finally {
    if (connection) {
      await mongoose.disconnect();
      console.log('\n✓ MongoDB connection closed');
    }
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  updateUserPassword();
}

module.exports = { updateUserPassword };