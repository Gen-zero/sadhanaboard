const jwt = require('jsonwebtoken');
const { connectMongoDB, mongoose } = require('./config/mongodb');
const User = require('./schemas/User');
const Profile = require('./schemas/Profile');

async function testProfileUpdate() {
  try {
    await connectMongoDB();
    
    // Get a test user
    const user = await User.findOne().limit(1);
    if (!user) {
      console.error('No users found');
      process.exit(1);
    }
    
    console.log('✓ Test user found:', user.email);
    console.log('  User ID:', user._id);
    
    // Verify profile exists
    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      console.error('No profile found for user');
      process.exit(1);
    }
    
    console.log('\n✓ Profile exists');
    console.log('  Profile ID:', profile._id);
    console.log('  Bio (before):', profile.bio);
    
    // Update profile with various fields
    const updateData = {
      bio: 'Updated bio: ' + new Date().toISOString(),
      avatar_url: 'https://example.com/new-avatar.jpg',
      traditions: ['Hindu', 'Buddhist'],
      practices: ['Meditation', 'Yoga', 'Prayer'],
      interests: ['Spirituality', 'Philosophy', 'Wellness'],
      location: 'Updated City, Updated Country',
      country: 'Updated Country',
      city: 'Updated City',
      state: 'Updated State'
    };
    
    const ProfileService = require('./services/profileService');
    const updated = await ProfileService.updateProfile(user._id, updateData);
    
    console.log('\n✓ Profile updated successfully!');
    console.log('  Bio (after):', updated.bio);
    console.log('  Avatar:', updated.avatar);
    console.log('  City:', updated.city);
    console.log('  Country:', updated.country);
    console.log('  State:', updated.state);
    console.log('  Traditions:', updated.traditions);
    console.log('  Practices:', updated.practices);
    console.log('  Interests:', updated.interests);
    
    // Verify data was persisted to database
    const verifyProfile = await Profile.findOne({ userId: user._id });
    console.log('\n✓ Verification - Reading from DB:');
    console.log('  Bio matches:', verifyProfile.bio === updated.bio);
    console.log('  Avatar matches:', verifyProfile.avatar === updated.avatar);
    console.log('  City matches:', verifyProfile.city === updated.city);
    
    console.log('\n✅ Profile update test PASSED!');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

testProfileUpdate();
