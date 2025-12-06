#!/usr/bin/env node

/**
 * createProfileForTestUser.js - Add demo profile data for test@sadhanaboard.com
 * Usage: node backend/scripts/createProfileForTestUser.js
 * 
 * This script creates a profile with demo data for the test user in MongoDB Atlas.
 */

require('dotenv').config({ path: __dirname + '/../.env' });

const mongoose = require('mongoose');

// Import schemas
const User = require('../schemas/User');
const Profile = require('../schemas/Profile');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://subham4343_db_user:RsD0qysfLKGeX3GL@cluster1.mn2ty8w.mongodb.net/?appName=Cluster1';

async function createProfileForTestUser() {
  let connection = null;
  
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    
    // Connect to MongoDB
    connection = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: 'majority',
      appName: 'SaadhanaBoard'
    });
    
    console.log('✓ MongoDB connected successfully\n');

    // Find the test user
    console.log('🔍 Looking for test@sadhanaboard.com user...');
    const testUser = await User.findOne({ email: 'test@sadhanaboard.com' });
    
    if (!testUser) {
      console.error('❌ Test user not found. Please create the test user first.');
      console.error('   Run: node backend/scripts/createTestUser.js\n');
      process.exit(1);
    }

    console.log(`✓ Found test user: ${testUser.displayName}`);
    console.log(`  User ID: ${testUser._id}\n`);

    // Check if profile already exists
    console.log('🔍 Checking if profile already exists...');
    const existingProfile = await Profile.findOne({ userId: testUser._id });
    
    if (existingProfile) {
      console.log('⚠️  Profile already exists for this user.');
      console.log(`  Profile ID: ${existingProfile._id}`);
      console.log(`  Updated: ${existingProfile.updatedAt}\n`);
      console.log('💡 To update, delete the existing profile and run this script again.\n');
      return;
    }

    // Create profile with demo data
    console.log('✍️  Creating profile with demo data...\n');
    
    const demoProfile = new Profile({
      userId: testUser._id,
      bio: 'A passionate spiritual seeker exploring various traditions and practices. Dedicated to personal growth and mindfulness.',
      avatar: 'https://ui-avatars.com/api/?name=Test+User&background=6366f1&color=fff',
      coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=400&fit=crop',
      traditions: ['Hindu', 'Buddhist'],
      practices: ['Meditation', 'Yoga', 'Prayer'],
      interests: ['Spirituality', 'Mindfulness', 'Philosophy', 'Wellness'],
      country: 'India',
      city: 'Mumbai',
      state: 'Maharashtra',
      socialLinks: {
        twitter: 'https://twitter.com/testuser',
        instagram: 'https://instagram.com/testuser',
        website: 'https://testuser.com'
      },
      profileCompleteness: 75,
      totalSadhanas: 5,
      totalBooks: 3,
      totalConnections: 12,
      showEmail: false,
      showLocation: true,
      showTraditions: true,
      isVerified: false,
      onboarding_completed: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedProfile = await demoProfile.save();

    console.log('✅ Profile created successfully!\n');
    console.log('📊 Profile Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Profile ID:        ${savedProfile._id}`);
    console.log(`User Email:        ${testUser.email}`);
    console.log(`User Name:         ${testUser.displayName}`);
    console.log(`Bio:               ${savedProfile.bio.substring(0, 50)}...`);
    console.log(`Country:           ${savedProfile.country}`);
    console.log(`City:              ${savedProfile.city}`);
    console.log(`Traditions:        ${savedProfile.traditions.join(', ')}`);
    console.log(`Practices:         ${savedProfile.practices.join(', ')}`);
    console.log(`Profile Complete:  ${savedProfile.profileCompleteness}%`);
    console.log(`Total Sadhanas:    ${savedProfile.totalSadhanas}`);
    console.log(`Total Books:       ${savedProfile.totalBooks}`);
    console.log(`Total Connections: ${savedProfile.totalConnections}`);
    console.log(`Onboarding Done:   ${savedProfile.onboarding_completed}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✨ Demo profile is ready for testing!');

  } catch (error) {
    console.error('❌ Error creating profile:');
    console.error(`   ${error.message}\n`);
    
    if (error.code === 11000) {
      console.error('   Duplicate key error: Profile already exists for this user');
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
  createProfileForTestUser();
}

module.exports = { createProfileForTestUser };
