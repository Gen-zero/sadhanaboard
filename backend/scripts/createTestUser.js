#!/usr/bin/env node

/**
 * createTestUser.js - Utility script to create a test user in MongoDB
 * Usage: node backend/scripts/createTestUser.js
 * 
 * This script creates a test user for development and testing purposes.
 * It connects to MongoDB Atlas and creates a user with bcrypt-hashed password.
 */

require('dotenv').config({ path: __dirname + '/../.env' });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import User schema
const User = require('../schemas/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://subham4343_db_user:RsD0qysfLKGeX3GL@cluster1.mn2ty8w.mongodb.net/?appName=Cluster1';

async function createTestUser() {
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

    // Test user credentials
    const testUserData = {
      email: 'test@sadhanaboard.com',
      displayName: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      password: 'Test@123456',
      timezone: 'UTC',
      language: 'en',
      status: 'active',
      isEmailVerified: true,
      isPublicProfile: true
    };

    console.log('📝 Test User Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:       ${testUserData.email}`);
    console.log(`Display:     ${testUserData.displayName}`);
    console.log(`Password:    ${testUserData.password}`);
    console.log(`Status:      ${testUserData.status}`);
    console.log(`Verified:    ${testUserData.isEmailVerified}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check if user already exists
    console.log('🔍 Checking if user already exists...');
    const existingUser = await User.findOne({ email: testUserData.email });
    
    if (existingUser) {
      console.log('✓ Test user already exists!');
      console.log(`  User ID: ${existingUser._id}`);
      console.log(`  Created: ${existingUser.createdAt}`);
      return;
    }

    // Hash password using bcrypt
    console.log('🔐 Hashing password...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(testUserData.password, saltRounds);

    // Create new user
    console.log('✍️  Creating test user...');
    const newUser = await User.create({
      email: testUserData.email,
      displayName: testUserData.displayName,
      firstName: testUserData.firstName,
      lastName: testUserData.lastName,
      password: hashedPassword,
      timezone: testUserData.timezone,
      language: testUserData.language,
      status: testUserData.status,
      isEmailVerified: testUserData.isEmailVerified,
      isPublicProfile: testUserData.isPublicProfile,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('\n✅ Test user created successfully!\n');
    console.log('📊 User Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`User ID:     ${newUser._id}`);
    console.log(`Email:       ${newUser.email}`);
    console.log(`Display:     ${newUser.displayName}`);
    console.log(`Status:      ${newUser.status}`);
    console.log(`Verified:    ${newUser.isEmailVerified}`);
    console.log(`Created:     ${newUser.createdAt}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🔐 Login with:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:       ${testUserData.email}`);
    console.log(`Password:    ${testUserData.password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✨ Test user is ready for testing!');

  } catch (error) {
    console.error('❌ Error creating test user:');
    console.error(`   ${error.message}\n`);
    
    if (error.code === 11000) {
      console.error('   Duplicate key error: Email already exists');
    }
    
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
  createTestUser();
}

module.exports = { createTestUser };
