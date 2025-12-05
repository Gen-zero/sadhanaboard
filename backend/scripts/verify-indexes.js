#!/usr/bin/env node

/**
 * Index Verification Script
 * Verifies that all MongoDB indexes are created on required collections
 * Run with: node scripts/verify-indexes.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import schemas
const User = require('../schemas/User');
const Sadhana = require('../schemas/Sadhana');
const SadhanaProgress = require('../schemas/SadhanaProgress');
const SpiritualBook = require('../schemas/SpiritualBook');
const Profile = require('../schemas/Profile');
const Mentorship = require('../schemas/Mentorship');
const Community = require('../schemas/Group');

const MODELS = [
  { name: 'User', model: User },
  { name: 'Sadhana', model: Sadhana },
  { name: 'SadhanaProgress', model: SadhanaProgress },
  { name: 'SpiritualBook', model: SpiritualBook },
  { name: 'Profile', model: Profile },
  { name: 'Mentorship', model: Mentorship },
  { name: 'Community', model: Community }
];

async function verifyIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 5,
      minPoolSize: 1
    });

    console.log('✅ Connected to MongoDB\n');

    let totalIndexes = 0;
    let successfulCollections = 0;

    for (const { name, model } of MODELS) {
      try {
        // Get collection indexes
        const indexInfo = await model.collection.getIndexes();
        const indexCount = Object.keys(indexInfo).length;
        totalIndexes += indexCount;
        successfulCollections++;

        console.log(`📊 ${name} Collection:`);
        console.log(`   Total Indexes: ${indexCount}`);
        console.log('   Indexes:');
        
        Object.entries(indexInfo).forEach(([indexName, indexSpec]) => {
          console.log(`     - ${indexName}: ${JSON.stringify(indexSpec.key)}`);
        });
        console.log('');
      } catch (error) {
        console.error(`❌ Error checking ${name}: ${error.message}\n`);
      }
    }

    console.log('\n=====================================');
    console.log(`✅ Verification Summary:`);
    console.log(`   Collections Checked: ${MODELS.length}`);
    console.log(`   Collections with Indexes: ${successfulCollections}`);
    console.log(`   Total Indexes Created: ${totalIndexes}`);
    console.log('=====================================\n');

    // Disconnect
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
    process.exit(1);
  }
}

verifyIndexes();
