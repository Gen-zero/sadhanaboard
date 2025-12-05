/**
 * Mongoose Configuration
 * 
 * Optimizes MongoDB connection with proper pool sizing and performance settings
 * Configuration varies based on NODE_ENV (development vs production)
 */

const mongoose = require('mongoose');

/**
 * Connection options based on environment
 */
const getConnectionOptions = () => {
  const env = process.env.NODE_ENV || 'development';

  const baseOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4
    retryWrites: true,
    journal: true,
    authSource: 'admin'
  };

  if (env === 'production') {
    return {
      ...baseOptions,
      // Production settings for high load
      maxPoolSize: 20,
      minPoolSize: 5,
      maxIdleTimeMS: 45000,
      waitQueueTimeoutMS: 10000,
      // Connection monitoring
      monitorCommands: false,
      // Replication
      replicaSet: 'rs0',
      // TLS for secure connection
      tls: true,
      tlsCAFile: process.env.TLS_CA_FILE || undefined,
      // Write concern for data safety
      writeConcern: { w: 'majority', j: true },
      readConcern: { level: 'majority' },
      readPreference: 'primary'
    };
  } else if (env === 'staging') {
    return {
      ...baseOptions,
      // Staging settings - balanced performance
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 45000,
      waitQueueTimeoutMS: 10000,
      tls: true,
      writeConcern: { w: 'majority', j: true },
      readPreference: 'primaryPreferred'
    };
  } else {
    // Development settings
    return {
      ...baseOptions,
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 60000,
      waitQueueTimeoutMS: 5000,
      // Less strict for development
      tls: false,
      writeConcern: { w: 1 },
      readPreference: 'primary'
    };
  }
};

/**
 * Connect to MongoDB with optimized settings
 * @param {String} uri - MongoDB connection string
 * @returns {Promise<void>}
 */
async function connectMongoDB(uri) {
  try {
    const options = getConnectionOptions();
    
    console.log(`🔄 Connecting to MongoDB (${process.env.NODE_ENV || 'development'})...`);
    console.log(`   Pool Size: ${options.maxPoolSize} max, ${options.minPoolSize} min`);

    await mongoose.connect(uri, options);

    console.log('✅ MongoDB connected successfully');

    // Monitor connection events
    setupConnectionMonitoring();

    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}

/**
 * Setup connection event monitoring
 */
function setupConnectionMonitoring() {
  mongoose.connection.on('connected', () => {
    console.log('📊 MongoDB connection established');
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
  });

  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB error:', error.message);
  });

  mongoose.connection.on('reconnected', () => {
    console.log('♻️  MongoDB reconnected');
  });
}

/**
 * Get MongoDB connection statistics
 * @returns {Object} Connection stats
 */
function getConnectionStats() {
  const connection = mongoose.connection;
  
  return {
    state: connection.readyState,
    stateString: ['disconnected', 'connected', 'connecting', 'disconnecting'][connection.readyState],
    host: connection.host,
    port: connection.port,
    name: connection.name,
    models: Object.keys(connection.models).length,
    collections: Object.keys(connection.collections).length
  };
}

/**
 * Graceful shutdown
 */
async function disconnectMongoDB() {
  try {
    console.log('🛑 Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error.message);
    throw error;
  }
}

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
  getConnectionOptions,
  getConnectionStats
};
