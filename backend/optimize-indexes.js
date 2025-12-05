#!/usr/bin/env node

/**
 * MongoDB Index Optimization Script
 * Creates essential indexes for fast queries
 * Usage: node optimize-indexes.js
 */

require('dotenv').config({ path: '.env.development' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not set');
  process.exit(1);
}

async function optimizeIndexes() {
  try {
    console.log('🔌 Connecting to MongoDB...\n');
    
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      appName: 'SaadhanaBoard'
    });

    console.log('✅ MongoDB connected successfully\n');

    const db = mongoose.connection.db;

    // Define indexes for each collection
    const indexes = {
      users: [
        { spec: { email: 1 }, options: { unique: true } },
        { spec: { username: 1 }, options: { unique: true } },
        { spec: { created_at: -1 }, options: {} },
        { spec: { is_active: 1, last_login: -1 }, options: {} }
      ],
      sadhanas: [
        { spec: { userId: 1 }, options: {} },
        { spec: { userId: 1, status: 1 }, options: {} },
        { spec: { userId: 1, created_at: -1 }, options: {} },
        { spec: { status: 1 }, options: {} },
        { spec: { isPublic: 1 }, options: {} }
      ],
      books: [
        { spec: { title: 1 }, options: {} },
        { spec: { author: 1 }, options: {} },
        { spec: { created_at: -1 }, options: {} }
      ],
      comments: [
        { spec: { sadhanaId: 1 }, options: {} },
        { spec: { userId: 1 }, options: {} },
        { spec: { sadhanaId: 1, created_at: -1 }, options: {} }
      ],
      goals: [
        { spec: { userId: 1 }, options: {} },
        { spec: { userId: 1, status: 1 }, options: {} },
        { spec: { dueDate: 1 }, options: {} }
      ],
      templates: [
        { spec: { userId: 1 }, options: {} },
        { spec: { isPublic: 1 }, options: {} }
      ],
      notifications: [
        { spec: { userId: 1 }, options: {} },
        { spec: { userId: 1, isRead: 1 }, options: {} },
        { spec: { userId: 1, created_at: -1 }, options: {} }
      ]
    };

    console.log('📊 Creating indexes...\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalIndexes = 0;
    let createdIndexes = 0;

    for (const [collection, indexList] of Object.entries(indexes)) {
      try {
        const col = db.collection(collection);
        
        for (const { spec, options } of indexList) {
          totalIndexes++;
          try {
            const result = await col.createIndex(spec, options);
            createdIndexes++;
            const specStr = JSON.stringify(spec);
            console.log(`✅ [${collection}] Index created: ${specStr}`);
          } catch (err) {
            if (err.message.includes('already exists')) {
              console.log(`ℹ️  [${collection}] Index already exists: ${JSON.stringify(spec)}`);
              createdIndexes++;
            } else {
              console.warn(`⚠️  [${collection}] Failed to create index: ${err.message}`);
            }
          }
        }
      } catch (err) {
        console.error(`❌ [${collection}] Error: ${err.message}`);
      }
    }

    console.log('\n═══════════════════════════════════════════════════════════════\n');
    console.log(`✅ Index Optimization Complete!`);
    console.log(`   Total Indexes: ${totalIndexes}`);
    console.log(`   Created/Verified: ${createdIndexes}\n`);

    // Get index statistics
    console.log('📈 Index Statistics:\n');
    
    for (const collection of Object.keys(indexes)) {
      try {
        const col = db.collection(collection);
        const indexInfo = await col.getIndexes();
        console.log(`[${collection}] Total indexes: ${Object.keys(indexInfo).length}`);
      } catch (err) {
        console.log(`[${collection}] Could not fetch index info`);
      }
    }

    console.log('\n🎯 Performance Improvements:\n');
    console.log('✓ Faster user lookups by email');
    console.log('✓ Faster user lookups by username');
    console.log('✓ Faster sadhana queries by user');
    console.log('✓ Faster comments queries by sadhana');
    console.log('✓ Faster date-based sorting (created_at, dueDate)');
    console.log('✓ Faster status filtering');
    console.log('✓ Compound indexes for complex queries\n');

    console.log('💡 Tips:\n');
    console.log('• Indexes speed up queries but slow down writes');
    console.log('• Regularly monitor index usage');
    console.log('• Drop unused indexes to save storage');
    console.log('• Use compound indexes for common filter combinations\n');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);

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
optimizeIndexes();
