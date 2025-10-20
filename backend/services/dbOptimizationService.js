const db = require('../config/db');

async function analyzeQueryPerformance(limit = 50) {
  try {
    const r = await db.query("SELECT query, calls, total_time, mean_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT $1", [limit]);
    return r.rows || [];
  } catch (e) {
    return { error: 'pg_stat_statements not available or permission denied' };
  }
}

async function getConnectionPoolStatus() {
  try {
    const r = await db.query("SELECT state, count(*) as cnt FROM pg_stat_activity GROUP BY state;", []);
    return r.rows || [];
  } catch (e) { return [] }
}

async function runVacuumAnalyze(tableName) {
  const client = await db.connect();
  try {
    if (tableName) {
      await client.query(`VACUUM ANALYZE ${tableName};`);
      return { ok: true, table: tableName };
    }
    await client.query('VACUUM ANALYZE;');
    return { ok: true };
  } catch (e) { 
    return { error: String(e) }; 
  } finally {
    client.release();
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