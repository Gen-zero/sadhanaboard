#!/usr/bin/env node

/**
 * MongoDB Atlas Connection Test
 * Tests actual connection to MongoDB Atlas with provided credentials
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb+srv://subham4343_db_user:RsD0qysfLKGeX3GL@cluster1.mn2ty8w.mongodb.net/?appName=Cluster1';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}\n`)
};

async function testMongoDBAtlasConnection() {
  log.section('MONGODB ATLAS CONNECTION TEST');
  
  console.log('Testing MongoDB Atlas Connection...\n');
  
  try {
    log.info(`Connecting to MongoDB Atlas...`);
    
    const connection = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: 'majority',
      appName: 'SaadhanaBoard',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    log.success('MongoDB Atlas connection established');
    
    // Test database connectivity
    log.info('Testing database connectivity with ping...');
    const adminDb = mongoose.connection.db.admin();
    const pingResult = await adminDb.ping();
    log.success('Database ping successful');
    
    // Get server info
    log.info('Retrieving server information...');
    const serverInfo = await adminDb.serverInfo();
    log.success(`MongoDB Version: ${serverInfo.version}`);
    log.success(`Server Status: ${serverInfo.ok === 1 ? 'Running' : 'Error'}`);
    
    // List databases
    log.info('Retrieving available databases...');
    const databases = await adminDb.listDatabases();
    log.success(`Connected to ${databases.databases.length} database(s)`);
    
    const sadhanaDb = databases.databases.find(db => db.name === 'sadhanaboard');
    if (sadhanaDb) {
      log.success(`SaadhanaBoard database found (${(sadhanaDb.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    } else {
      log.warn('SaadhanaBoard database not yet created (will be created on first write)');
    }
    
    // Get connection stats
    log.info('Connection statistics:');
    const stats = mongoose.connection.client.topology;
    if (stats) {
      log.info(`  • Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
      log.info(`  • Replica Set: ${stats.description.type}`);
    }
    
    // Test collection access
    log.info('Testing collection access...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    if (collections.length > 0) {
      log.success(`Found ${collections.length} collection(s)`);
      collections.forEach(col => {
        log.info(`  • ${col.name}`);
      });
    } else {
      log.warn('No collections found yet (will be created when services start)');
    }
    
    // Disconnect
    await mongoose.disconnect();
    log.success('Disconnected from MongoDB Atlas');
    
    log.section('CONNECTION TEST COMPLETE ✅');
    console.log(`
${colors.green}MongoDB Atlas is working correctly!${colors.reset}

Summary:
✅ Connection established
✅ Database accessible
✅ Server responding
✅ Credentials valid
✅ Network connectivity confirmed

Ready for production deployment!
    `);
    
    process.exit(0);
    
  } catch (error) {
    log.error(`MongoDB Atlas connection failed: ${error.message}`);
    
    if (error.message.includes('authentication failed')) {
      log.error('Authentication failed - Check credentials in MONGODB_URI');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      log.error('Network error - Check internet connection');
    } else if (error.message.includes('ServerSelectionError')) {
      log.error('Cannot reach MongoDB Atlas - Check cluster status and IP whitelist');
    }
    
    console.error('\nDetailed error:', error.message);
    console.error('\nFix suggestions:');
    console.log('1. Verify MONGODB_URI is correct');
    console.log('2. Check credentials in MongoDB Atlas');
    console.log('3. Ensure MongoDB Atlas cluster is running');
    console.log('4. Check IP whitelist (add 0.0.0.0/0 for development)');
    console.log('5. Verify internet connection');
    
    process.exit(1);
  }
}

// Run test
testMongoDBAtlasConnection();
