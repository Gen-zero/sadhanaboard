#!/usr/bin/env node

/**
 * Script to login and get a JWT token
 */

require('dotenv').config({ path: '.env.development' });
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'saadhanaboard_secret_key';

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not set');
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET is not set');
  process.exit(1);
}

async function loginUser(email, password) {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      appName: 'SaadhanaBoard'
    });

    console.log('✅ MongoDB connected successfully\n');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Find user
    const user = await usersCollection.findOne({ email: email });
    
    if (!user) {
      console.log('❌ User not found');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.email} (${user.display_name || 'No display name'})`);

    // For testing purposes, let's just generate a token without password verification
    // In a real scenario, we would verify the password
    
    console.log('\n🔐 Generating JWT token...');
    
    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log('\n✅ Login successful!\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🔑 Authentication Token:');
    console.log('─────────────────────────────────────────────────────────────');
    console.log(token);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    console.log('💡 You can use this token in your API requests by adding:');
    console.log('   Authorization: Bearer YOUR_TOKEN_HERE');
    console.log('\nExample curl command:');
    console.log(`   curl -H "Authorization: Bearer ${token}" http://localhost:3004/api/custom-sadhanas`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

  } catch (error) {
    if (error.message.includes('Could not connect to any servers')) {
      console.error('❌ MongoDB Connection Error');
      console.error('   The MongoDB Atlas cluster is not accessible from your IP address.');
      console.error('   You need to whitelist your IP in MongoDB Atlas:');
      console.error('   1. Go to MongoDB Atlas Console');
      console.error('   2. Navigate to: Security → Network Access');
      console.error('   3. Add your IP address to the whitelist');
      console.error('   4. Try again in 5 minutes after the change propagates\n');
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('❌ Missing email argument\n');
  console.log('Usage: node login-user.js <email>\n');
  console.log('Example:');
  console.log('  node login-user.js suhanisaxena0107@gmail.com');
  process.exit(1);
}

// Run the script
loginUser(email);