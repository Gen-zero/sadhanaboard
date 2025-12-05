#!/usr/bin/env node

/**
 * Script to add a new user to MongoDB
 * Usage: node add-user.js --username <name> --email <email> --password <password>
 * Example: node add-user.js --username Vaibhav --email vaibhav052025@gmail.com --password Subham@98
 */

require('dotenv').config({ path: '.env.development' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'sadhanaboard';

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not set');
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const username = args[args.indexOf('--username') + 1];
const email = args[args.indexOf('--email') + 1];
const password = args[args.indexOf('--password') + 1];

if (!username || !email || !password) {
  console.log('❌ Missing required arguments\n');
  console.log('Usage: node add-user.js --username <name> --email <email> --password <password>\n');
  console.log('Example:');
  console.log('  node add-user.js --username Vaibhav --email vaibhav052025@gmail.com --password Subham@98');
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

async function addUser() {
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

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      console.warn('⚠️  User already exists!');
      if (existingUser.email === email.toLowerCase()) {
        console.warn(`   Email: ${existingUser.email} already registered`);
      }
      if (existingUser.username === username.toLowerCase()) {
        console.warn(`   Username: ${existingUser.username} already taken`);
      }
      await mongoose.disconnect();
      process.exit(1);
    }

    // Hash the password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user document
    const newUser = {
      username: username,
      email: email.toLowerCase(),
      password: hashedPassword,
      display_name: username,
      avatar_url: null,
      bio: null,
      location: null,
      website: null,
      created_at: new Date(),
      updated_at: new Date(),
      last_login: null,
      is_active: true,
      is_verified: false,
      notification_preferences: {
        email_notifications: true,
        push_notifications: true,
        digest_frequency: 'weekly'
      },
      privacy_settings: {
        profile_visibility: 'public',
        show_activity: true,
        allow_messages: true
      },
      preferences: {
        theme: 'light',
        language: 'en',
        notifications_enabled: true
      },
      roles: ['user'],
      sadhana_stats: {
        total_sadhanas: 0,
        completed_sadhanas: 0,
        in_progress_sadhanas: 0,
        total_sessions: 0,
        total_minutes: 0,
        streak_count: 0,
        longest_streak: 0,
        last_activity: null
      }
    };

    // Insert the user
    console.log('\n📝 Adding user to database...');
    const result = await usersCollection.insertOne(newUser);

    console.log('\n✅ User added successfully!\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📊 User Details:');
    console.log('─────────────────────────────────────────────────────────────');
    console.log(`  User ID:      ${result.insertedId}`);
    console.log(`  Username:     ${username}`);
    console.log(`  Email:        ${email}`);
    console.log(`  Display Name: ${username}`);
    console.log(`  Status:       Active`);
    console.log(`  Role:         User`);
    console.log(`  Created At:   ${newUser.created_at.toISOString()}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log('✨ User account created successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n💡 Tip: User can also login with username instead of email\n');

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

// Run the script
addUser();
