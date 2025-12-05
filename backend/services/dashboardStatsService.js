const User = require('../schemas/User');
const Sadhana = require('../schemas/Sadhana');
const Book = require('../schemas/Book');
const Theme = require('../schemas/Theme');
const SadhanaSession = require('../schemas/SadhanaSession');

async function getBasicStats() {
  try {
    const [users, activeUsers, activeSadhanas, completedSadhanas, books, themes] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ active: true }),
      Sadhana.countDocuments({ status: 'active' }),
      Sadhana.countDocuments({ status: 'completed' }),
      Book.countDocuments(),
      Theme.countDocuments()
    ]);

    return {
      totalUsers: users,
      activeUsers: activeUsers,
      activeSadhanas: activeSadhanas,
      completedSadhanas: completedSadhanas,
      uploadedBooks: books,
      currentThemes: themes
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
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
    const [weeklyLogins, weeklySadhanaCompletions] = await Promise.all([
      User.aggregate([
        { $match: { lastLogin: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$lastLogin' } },
            logins: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Sadhana.aggregate([
        { $match: { status: 'completed', updatedAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
            completions: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    return {
      weeklyLogins: weeklyLogins.map(r => ({ date: r._id, logins: r.logins })),
      weeklySadhanaCompletions: weeklySadhanaCompletions.map(r => ({ date: r._id, completions: r.completions }))
    };
  } catch (error) {
    console.warn('Weekly trends query failed, returning placeholder data:', error.message);
    return { weeklyLogins: [], weeklySadhanaCompletions: [], note: 'Database unavailable - placeholder data' };
  }
}

async function getUserEngagement() {
  try {
    const avgDurationResult = await SadhanaSession.aggregate([
      { $match: { endedAt: { $ne: null } } },
      {
        $project: {
          durationMinutes: {
            $divide: [{ $subtract: ['$endedAt', '$startedAt'] }, 60000]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgMinutes: { $avg: '$durationMinutes' }
        }
      }
    ]);

    const sessionsPerUser = await SadhanaSession.aggregate([
      { $group: { _id: '$userId', sessions: { $sum: 1 } } },
      { $sort: { sessions: -1 } },
      { $limit: 10 }
    ]);

    return {
      averagePracticeMinutes: Number(avgDurationResult[0]?.avgMinutes || 0),
      topSessions: sessionsPerUser.map(s => ({ userId: s._id, sessions: s.sessions }))
    };
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