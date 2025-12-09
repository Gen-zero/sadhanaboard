#!/usr/bin/env node

/**
 * createSpecificUser.js - Utility script to create a specific user in MongoDB
 * Usage: node backend/scripts/createSpecificUser.js
 * 
 * This script creates a user with specific credentials for testing purposes.
 * It connects to MongoDB Atlas and creates a user with bcrypt-hashed password.
 */

require('dotenv').config({ path: __dirname + '/../.env.development' });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import User and Profile schemas
const User = require('../schemas/User');
const Profile = require('../schemas/Profile');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://subham4343_db_user:RsD0qysfLKGeX3GL@cluster1.mn2ty8w.mongodb.net/?appName=Cluster1';

async function createSpecificUser() {
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

    // Specific user credentials
    const userData = {
      email: 'suhanisaxena0107@gmail.com',
      displayName: 'Suhani Saxena',
      password: 'Suhani@123',
      timezone: 'UTC',
      language: 'en',
      status: 'active',
      isEmailVerified: true,
      isPublicProfile: true
    };

    console.log('📝 User Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:       ${userData.email}`);
    console.log(`Display:     ${userData.displayName}`);
    console.log(`Password:    ${userData.password}`);
    console.log(`Status:      ${userData.status}`);
    console.log(`Verified:    ${userData.isEmailVerified}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check if user already exists
    console.log('🔍 Checking if user already exists...');
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      console.log('⚠️  User already exists!');
      console.log(`  User ID: ${existingUser._id}`);
      console.log(`  Created: ${existingUser.createdAt}`);
      return;
    }

    // Hash password using bcrypt
    console.log('🔐 Hashing password...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create new user
    console.log('✍️  Creating user...');
    const newUser = await User.create({
      email: userData.email,
      displayName: userData.displayName,
      password: hashedPassword,
      timezone: userData.timezone,
      language: userData.language,
      status: userData.status,
      isEmailVerified: userData.isEmailVerified,
      isPublicProfile: userData.isPublicProfile,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create associated profile
    console.log('👤 Creating user profile...');
    const newProfile = await Profile.create({
      userId: newUser._id,
      displayName: userData.displayName,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('\n✅ User created successfully!\n');
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
    console.log(`Email:       ${userData.email}`);
    console.log(`Password:    ${userData.password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✨ User is ready for use!');

  } catch (error) {
    console.error('❌ Error creating user:');
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
  createSpecificUser();
}

module.exports = { createSpecificUser };