#!/usr/bin/env node

/**
 * Script to retrieve data from MongoDB
 * Usage: node retrieve-data.js [collection] [limit]
 * Example: node retrieve-data.js users 10
 */

require('dotenv').config({ path: '.env.development' });
const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'sadhanaboard';

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not set');
  process.exit(1);
}

// Get collection name from command line arguments
const collectionName = process.argv[2] || 'users';
const limit = parseInt(process.argv[3]) || 10;

async function retrieveData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      appName: 'SaadhanaBoard'
    });

    console.log('✅ MongoDB connected successfully\n');

    const db = mongoose.connection.db;
    
    // List all collections if none specified
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log(`📦 Available Collections (${collectionNames.length}):`);
    console.log(collectionNames.map(c => `  - ${c}`).join('\n'));
    console.log();

    // Check if requested collection exists
    if (!collectionNames.includes(collectionName)) {
      console.warn(`⚠️  Collection '${collectionName}' not found. Available collections:`);
      console.log(collectionNames.map(c => `  - ${c}`).join('\n'));
      console.log('\nUsage: node retrieve-data.js [collection] [limit]');
      console.log('Example: node retrieve-data.js users 10');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Retrieve data from collection
    const collection = db.collection(collectionName);
    const count = await collection.countDocuments();
    
    console.log(`\n📄 Collection: ${collectionName}`);
    console.log(`📊 Total Documents: ${count}`);
    console.log(`📥 Fetching first ${limit} documents...\n`);

    const documents = await collection.find({}).limit(limit).toArray();

    if (documents.length === 0) {
      console.log('No documents found.');
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log('═══════════════════════════════════════════════════════════════');
    documents.forEach((doc, index) => {
      console.log(`\n[${index + 1}] ID: ${doc._id}`);
      console.log('─────────────────────────────────────────────────────────────');
      console.log(JSON.stringify(doc, null, 2));
    });
    console.log('\n═══════════════════════════════════════════════════════════════');

    console.log(`\n✅ Retrieved ${documents.length} documents from '${collectionName}'`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
retrieveData();
