#!/usr/bin/env node

/**
 * createAdditionalTestUser.js - Create additional test users for testing
 * Usage: node backend/scripts/createAdditionalTestUser.js
 */

require('dotenv').config({ path: __dirname + '/../.env' });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import User schema
const User = require('../schemas/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://subham4343_db_user:RsD0qysfLKGeX3GL@cluster1.mn2ty8w.mongodb.net/?appName=Cluster1';

async function createAdditionalTestUsers() {
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

    // Multiple test users
    const testUsers = [
      {
        email: 'dev@sadhanaboard.com',
        displayName: 'Dev User',
        firstName: 'Dev',
        lastName: 'Test',
        password: 'Dev@123456'
      },
      {
        email: 'admin@sadhanaboard.com',
        displayName: 'Admin User',
        firstName: 'Admin',
        lastName: 'Test',
        password: 'Admin@123456'
      },
      {
        email: 'user@sadhanaboard.com',
        displayName: 'Regular User',
        firstName: 'Regular',
        lastName: 'User',
        password: 'User@123456'
      }
    ];

    console.log('📝 Creating test users...\n');

    for (const userData of testUsers) {
      try {
        // Check if user exists
        const existingUser = await User.findOne({ email: userData.email });
        
        if (existingUser) {
          console.log(`✓ User already exists: ${userData.email}`);
          console.log(`  User ID: ${existingUser._id}\n`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Create user
        const newUser = await User.create({
          email: userData.email,
          displayName: userData.displayName,
          firstName: userData.firstName,
          lastName: userData.lastName,
          password: hashedPassword,
          timezone: 'UTC',
          language: 'en',
          status: 'active',
          isEmailVerified: true,
          isPublicProfile: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        console.log(`✅ User created: ${userData.email}`);
        console.log(`   ID: ${newUser._id}`);
        console.log(`   Password: ${userData.password}\n`);

      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`);
        console.error(`   ${error.message}\n`);
      }
    }

    // List all test users
    console.log('\n📊 All Test Users:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const allUsers = await User.find({ email: { $in: testUsers.map(u => u.email) } });
    
    allUsers.forEach(user => {
      console.log(`\n🔐 ${user.displayName}`);
      console.log(`   Email:    ${user.email}`);
      console.log(`   ID:       ${user._id}`);
      console.log(`   Status:   ${user.status}`);
      console.log(`   Verified: ${user.isEmailVerified ? '✓' : '✗'}`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n✨ Total test users: ${allUsers.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await mongoose.disconnect();
      console.log('\n✓ MongoDB connection closed');
    }
    process.exit(0);
  }
}

if (require.main === module) {
  createAdditionalTestUsers();
}

module.exports = { createAdditionalTestUsers };
