const mongoose = require('mongoose');

async function analyzeQueryPerformance(limit = 50) {
  try {
    // MongoDB doesn't have pg_stat_statements, but we can use db.adminCommand for stats
    const admin = mongoose.connection.db.admin();
    const stats = await admin.serverStatus();
    if (stats && stats.opcounters) {
      return [
        { operation: 'insert', count: stats.opcounters.insert },
        { operation: 'query', count: stats.opcounters.query },
        { operation: 'update', count: stats.opcounters.update },
        { operation: 'delete', count: stats.opcounters.delete }
      ];
    }
    return [];
  } catch (e) {
    return { error: 'MongoDB server stats not available or permission denied' };
  }
}

async function getConnectionPoolStatus() {
  try {
    // Get MongoDB connection pool stats
    const client = mongoose.connection;
    if (client && client.getClient && typeof client.getClient === 'function') {
      const mongoClient = client.getClient();
      const poolStats = mongoClient.topology?.s?.pool?.poolStats?.();
      if (poolStats) {
        return [
          { state: 'available', cnt: poolStats.availableConnectionCount || 0 },
          { state: 'total', cnt: poolStats.totalConnectionCount || 0 }
        ];
      }
    }
    return [];
  } catch (e) {
    return [];
  }
}

async function runVacuumAnalyze(collectionName) {
  try {
    if (collectionName) {
      // MongoDB doesn't have VACUUM, but we can rebuild indexes
      const db = mongoose.connection.db;
      await db.collection(collectionName).reIndex();
      return { ok: true, collection: collectionName };
    }
    // For all collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      try {
        await db.collection(col.name).reIndex();
      } catch (e) {
        // ignore errors for system collections
      }
    }
    return { ok: true };
  } catch (e) {
    return { error: String(e) };
  }
}

async function identifyMissingIndexes() {
  // naive placeholder
  return [];
}

module.exports = {
  analyzeQueryPerformance,
  getConnectionPoolStatus,
  runVacuumAnalyze,
  identifyMissingIndexes,
};