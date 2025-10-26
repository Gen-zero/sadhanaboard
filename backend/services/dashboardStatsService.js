const db = require('../config/db');

async function getBasicStats() {
  try {
    const users = await db.query('SELECT COUNT(*)::int AS c FROM users');
    const activeUsers = await db.query('SELECT COUNT(*)::int AS c FROM users WHERE active = true');
    const activeSadhanas = await db.query("SELECT COUNT(*)::int AS c FROM sadhanas WHERE status = 'active' ");
    const completedSadhanas = await db.query("SELECT COUNT(*)::int AS c FROM sadhanas WHERE status = 'completed' ");
    const books = await db.query('SELECT COUNT(*)::int AS c FROM books');
    const themes = await db.query('SELECT COUNT(*)::int AS c FROM themes');

    return {
      totalUsers: users.rows[0].c,
      activeUsers: activeUsers.rows[0].c,
      activeSadhanas: activeSadhanas.rows[0].c,
      completedSadhanas: completedSadhanas.rows[0].c,
      uploadedBooks: books.rows[0].c,
      currentThemes: themes.rows[0].c
    };
  } catch (error) {
    console.warn('Basic stats query failed, returning placeholder data:', error.message);
    return {
      totalUsers: 0,
      activeUsers: 0,
      activeSadhanas: 0,
      completedSadhanas: 0,
      uploadedBooks: 0,
      currentThemes: 0,
      note: 'Database unavailable - placeholder data'
    };
  }
}

async function getWeeklyTrends() {
  try {
    const weeklyLogins = await db.query(`
      SELECT DATE_TRUNC('day', last_login) as date, COUNT(*)::int as logins
      FROM users WHERE last_login > NOW() - INTERVAL '7 days' GROUP BY DATE_TRUNC('day', last_login) ORDER BY date
    `);

    const weeklySadhanaCompletions = await db.query(`
      SELECT DATE_TRUNC('day', updated_at) as date, COUNT(*)::int as completions
      FROM sadhanas WHERE status = 'completed' AND updated_at > NOW() - INTERVAL '7 days' GROUP BY DATE_TRUNC('day', updated_at) ORDER BY date
    `);

    return { weeklyLogins: weeklyLogins.rows, weeklySadhanaCompletions: weeklySadhanaCompletions.rows };
  } catch (error) {
    console.warn('Weekly trends query failed, returning placeholder data:', error.message);
    return { weeklyLogins: [], weeklySadhanaCompletions: [], note: 'Database unavailable - placeholder data' };
  }
}

async function getUserEngagement() {
  try {
    // Example metrics: avg practice duration, sessions per user
    const avgDuration = await db.query(`
      SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (ended_at - started_at))/60),0)::numeric(10,2) as avg_minutes
      FROM sadhana_sessions WHERE ended_at IS NOT NULL
    `);

    const sessionsPerUser = await db.query(`
      SELECT user_id, COUNT(*)::int as sessions FROM sadhana_sessions GROUP BY user_id ORDER BY sessions DESC LIMIT 10
    `);

    return { averagePracticeMinutes: Number(avgDuration.rows[0].avg_minutes || 0), topSessions: sessionsPerUser.rows };
  } catch (error) {
    console.warn('User engagement query failed, returning placeholder data:', error.message);
    return { averagePracticeMinutes: 0, topSessions: [], note: 'Database unavailable - placeholder data' };
  }
}

async function getSystemHealth() {
  // Provide a lightweight estimation using Node's os and process stats
  try {
    const os = require('os');
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryUsagePercent = Math.round((usedMem / totalMem) * 100);

    // For CPU, use load average (1min) normalized to cores, as a simple proxy
    const cpus = os.cpus() || [];
    const cores = cpus.length || 1;
    const load = os.loadavg()[0] || 0; // 1 minute load average
    const cpuUsagePercent = Math.round((load / cores) * 100);

    // Try to get database pool stats
    let dbPoolStats = { active: null, idle: null, total: null };
    try {
      dbPoolStats = {
        active: db.totalCount ? db.totalCount() : null,
        idle: db.idleCount ? db.idleCount() : null,
        total: db.waitingCount ? db.waitingCount() : null
      };
    } catch (e) {
      // Ignore database pool stats errors
    }

    return {
      cpuUsagePercent: Number.isFinite(cpuUsagePercent) ? cpuUsagePercent : null,
      memoryUsagePercent: Number.isFinite(memoryUsagePercent) ? memoryUsagePercent : null,
      dbPool: dbPoolStats
    };
  } catch (e) {
    return { cpuUsagePercent: null, memoryUsagePercent: null, dbPool: { active: null, idle: null, total: null } };
  }
}

async function getAllDashboardStats() {
  const basic = await getBasicStats();
  const trends = await getWeeklyTrends();
  const engagement = await getUserEngagement();
  const health = await getSystemHealth();
  return { ...basic, ...trends, ...engagement, systemHealth: health };
}

module.exports = { getBasicStats, getWeeklyTrends, getUserEngagement, getSystemHealth, getAllDashboardStats };