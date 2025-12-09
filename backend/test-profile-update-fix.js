#!/usr/bin/env node

/**
 * Test script to verify profile update functionality with MongoDB Atlas
 * This tests that all profile fields are properly saved and retrieved
 */

require('dotenv').config({ path: '.env.development' });

const mongoose = require('mongoose');
const Profile = require('./schemas/Profile');
const User = require('./schemas/User');
const ProfileService = require('./backend/services/ProfileService');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI;

async function testProfileUpdate() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🧪 PROFILE UPDATE FIX VERIFICATION TEST');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas\n');

    // Create test user if it doesn't exist
    let testUser = await User.findByEmail('profile-test@sadhanaboard.com');
    if (!testUser) {
      console.log('👤 Creating test user...');
      const hashedPassword = await bcrypt.hash('testpassword123', 10);
      testUser = await User.create({
        email: 'profile-test@sadhanaboard.com',
        password: hashedPassword,
        displayName: 'Profile Test User',
        status: 'active'
      });
      console.log('✅ Test user created\n');
    } else {
      console.log('✅ Test user already exists\n');
    }

    // Create or get test profile
    let testProfile = await Profile.findOne({ userId: testUser._id });
    if (!testProfile) {
      console.log('📝 Creating test profile...');
      testProfile = await Profile.create({
        userId: testUser._id
      });
      console.log('✅ Test profile created\n');
    } else {
      console.log('✅ Test profile already exists\n');
    }

    // Test 1: Update basic profile fields
    console.log('🔄 Test 1: Updating basic profile fields...');
    const testData = {
      bio: 'Spiritual practitioner and meditation enthusiast',
      avatar_url: '/avatars/sampradayas/shakt1.png',
      traditions: ['Hindu'],
      practices: ['Meditation', 'Yoga'],
      interests: ['Spirituality', 'Philosophy'],
      city: 'Bangalore',
      country: 'India',
      state: 'Karnataka',
      socialLinks: {
        twitter: 'https://twitter.com/testuser',
        instagram: 'https://instagram.com/testuser'
      },
      experience_level: 'intermediate',
      favorite_deity: 'Shiva',
      gotra: 'Bharadwaja',
      varna: 'brahmana',
      sampradaya: 'Advaita Vedanta',
      date_of_birth: '1990-01-15',
      place_of_birth: 'Chennai',
      onboarding_completed: true
    };

    const updatedProfile = await ProfileService.updateProfile(testUser._id, testData);
    console.log('✅ Profile updated successfully\n');

    // Test 2: Verify all fields were saved
    console.log('🔍 Test 2: Verifying all fields were saved...');
    const savedProfile = await Profile.findOne({ userId: testUser._id });
    
    const fieldChecks = [
      { field: 'bio', expected: testData.bio, actual: savedProfile.bio },
      { field: 'avatar', expected: testData.avatar_url, actual: savedProfile.avatar },
      { field: 'traditions', expected: testData.traditions, actual: savedProfile.traditions },
      { field: 'practices', expected: testData.practices, actual: savedProfile.practices },
      { field: 'interests', expected: testData.interests, actual: savedProfile.interests },
      { field: 'city', expected: testData.city, actual: savedProfile.city },
      { field: 'country', expected: testData.country, actual: savedProfile.country },
      { field: 'state', expected: testData.state, actual: savedProfile.state },
      { field: 'experience_level', expected: testData.experience_level, actual: savedProfile.experience_level },
      { field: 'favorite_deity', expected: testData.favorite_deity, actual: savedProfile.favorite_deity },
      { field: 'gotra', expected: testData.gotra, actual: savedProfile.gotra },
      { field: 'varna', expected: testData.varna, actual: savedProfile.varna },
      { field: 'sampradaya', expected: testData.sampradaya, actual: savedProfile.sampradaya },
      { field: 'place_of_birth', expected: testData.place_of_birth, actual: savedProfile.place_of_birth },
      { field: 'onboarding_completed', expected: testData.onboarding_completed, actual: savedProfile.onboarding_completed }
    ];

    let allPassed = true;
    fieldChecks.forEach(({ field, expected, actual }) => {
      const match = JSON.stringify(expected) === JSON.stringify(actual);
      const status = match ? '✅' : '❌';
      console.log(`  ${status} ${field}: ${match ? 'PASS' : 'FAIL'}`);
      if (!match) {
        console.log(`     Expected: ${JSON.stringify(expected)}`);
        console.log(`     Got: ${JSON.stringify(actual)}`);
        allPassed = false;
      }
    });
    console.log();

    // Test 3: Test response format (avatar should be avatar_url)
    console.log('🔄 Test 3: Verifying response format (avatar → avatar_url)...');
    const responseData = savedProfile.toJSON();
    console.log(`  avatar_url in response: ${responseData.avatar_url ? '✅' : '❌'}`);
    console.log(`  avatar in response: ${responseData.avatar ? '❌ (should not exist)' : '✅ (correctly removed)'}`);
    console.log();

    // Test 4: Update with partial data
    console.log('🔄 Test 4: Updating with partial data (only bio)...');
    const partialUpdate = {
      bio: 'Updated bio - testing partial updates'
    };
    const partiallyUpdated = await ProfileService.updateProfile(testUser._id, partialUpdate);
    console.log(`  Old value: "${testData.bio}"`);
    console.log(`  New value: "${partiallyUpdated.bio}"`);
    console.log(`  Update successful: ${partiallyUpdated.bio === partialUpdate.bio ? '✅' : '❌'}\n`);

    // Cleanup
    console.log('🧹 Cleaning up test data...');
    await Profile.deleteOne({ userId: testUser._id });
    await User.deleteOne({ email: 'profile-test@sadhanaboard.com' });
    console.log('✅ Test data cleaned up\n');

    console.log('═══════════════════════════════════════════════════════════');
    if (allPassed) {
      console.log('🎉 ALL TESTS PASSED - PROFILE UPDATE FIXED!');
    } else {
      console.log('⚠️  SOME TESTS FAILED - NEEDS REVIEW');
    }
    console.log('═══════════════════════════════════════════════════════════\n');

    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

testProfileUpdate();
