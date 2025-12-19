#!/usr/bin/env node

/**
 * Script to list users in MongoDB
 */

require('dotenv').config({ path: '.env.development' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'sadhanaboard';

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not set');
  process.exit(1);
}

async function listUsers() {
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

    // List all users
    const users = await usersCollection.find({}).toArray();
    
    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      console.log(`Found ${users.length} user(s):\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.display_name}) - Created: ${user.created_at}`);
      });
    }

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');

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
listUsers();