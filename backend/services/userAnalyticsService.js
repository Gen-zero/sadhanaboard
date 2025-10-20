const db = require('../config/db');

/**
 * userAnalyticsService
 * Extended analytics per plan: practice trends, completion rates, streaks, comparative analytics, heatmaps, category insights
 */

// Simple in-memory cache
const analyticsCache = new Map();
function cacheSet(key, value, ttlMs) {
  const expires = Date.now() + ttlMs;
  analyticsCache.set(key, { value, expires });
}
function cacheGet(key) {
  const rec = analyticsCache.get(key);
  if (!rec) return null;
  if (rec.expires < Date.now()) { analyticsCache.delete(key); return null; }
  return rec.value;
}

function calculateGrowthRate(current, previous) {
  if (previous === 0 || previous === null || previous === undefined) {
    if (current === 0) return { value: 0, direction: 'stable' };
    return { value: 100, direction: 'up' };
  }
  const diff = current - previous;
  const pct = (diff / previous) * 100;
  const direction = pct > 0 ? 'up' : pct < 0 ? 'down' : 'stable';
  return { value: Math.round(pct * 10) / 10, direction };
}

const userAnalyticsService = {
  // existing helper: basic progress
  async getUserProgress(userId) {
    try {
      const totalQ = await db.query('SELECT COUNT(*)::int AS total FROM sadhanas WHERE user_id=$1', [userId]);
      const completedQ = await db.query("SELECT COUNT(*)::int AS completed FROM sadhanas WHERE user_id=$1 AND status='completed'", [userId]);
      const avgQ = await db.query('SELECT AVG(duration_minutes)::float AS avg_duration FROM sadhana_sessions WHERE user_id=$1', [userId]);
      const streakQ = await db.query("SELECT COUNT(DISTINCT DATE(started_at))::int AS recent_days FROM sadhana_sessions WHERE user_id=$1 AND started_at > NOW() - INTERVAL '14 days'", [userId]);

      return {
        totalSadhanas: totalQ.rows[0].total || 0,
        completedSadhanas: completedQ.rows[0].completed || 0,
        averageSessionMinutes: Math.round((avgQ.rows[0].avg_duration || 0) * 10) / 10,
        recentPracticeDays: streakQ.rows[0].recent_days || 0,
      };
    } catch (e) {
      console.error('getUserProgress error', e);
      throw e;
    }
  },

  // Practice trends: timeframe -> startDate, granularity -> date_trunc
  async getPracticeTrends(userId, timeframe = '30d', granularity = 'daily') {
    try {
      const cacheKey = `${userId}_practiceTrends_${timeframe}_${granularity}`;
      const cached = cacheGet(cacheKey);
      if (cached) return cached;

      const timeframeMap = {
        '7d': "NOW() - INTERVAL '7 days'",
        '30d': "NOW() - INTERVAL '30 days'",
        '90d': "NOW() - INTERVAL '90 days'",
        '1y': "NOW() - INTERVAL '365 days'",
        all: null
      };
      const startCond = timeframeMap[timeframe] || timeframeMap['30d'];

      let trunc;
      if (granularity === 'weekly') trunc = "date_trunc('week', progress_date)";
      else if (granularity === 'monthly') trunc = "date_trunc('month', progress_date)";
      else trunc = "date_trunc('day', progress_date)";

      const whereTime = startCond ? `AND progress_date >= ${startCond}` : '';

      // Aggregate completions and durations
      const q = `
        SELECT ${trunc} as period, COUNT(*) FILTER (WHERE completed = true) as completions, SUM(duration_minutes) as total_duration, AVG(duration_minutes) as avg_duration, COUNT(*) as practice_count
        FROM sadhana_progress
        WHERE user_id = $1 ${whereTime}
        GROUP BY period
        ORDER BY period ASC
      `;

      const res = await db.query(q, [userId]);

      // zero-fill: build date series in JS between min and max or from timeframe
      const rows = res.rows || [];
      const items = rows.map(r => ({ date: r.period.toISOString().split('T')[0], completions: parseInt(r.completions,10)||0, totalDuration: parseFloat(r.total_duration)||0, avgDuration: parseFloat(r.avg_duration)||0, practiceCount: parseInt(r.practice_count,10)||0 }));

      const summary = {
        totalCompletions: items.reduce((s, i) => s + i.completions, 0),
        totalDuration: Math.round(items.reduce((s, i) => s + i.totalDuration, 0)),
        avgCompletionsPerDay: items.length ? Math.round((items.reduce((s,i)=>s+i.completions,0)/items.length)*10)/10 : 0,
        avgDurationPerSession: items.length ? Math.round((items.reduce((s,i)=>s+i.avgDuration,0)/items.length)*10)/10 : 0
      };

      const result = { trends: items, summary };
      cacheSet(cacheKey, result, 1000 * 60 * 5); // 5 minutes
      return result;
    } catch (e) {
      console.error('getPracticeTrends error', e);
      return { trends: [], summary: { totalCompletions:0, totalDuration:0, avgCompletionsPerDay:0, avgDurationPerSession:0 } };
    }
  },

  async getCompletionRates(userId, groupBy = 'category', timeframe = '30d') {
    try {
      const cacheKey = `${userId}_completionRates_${groupBy}_${timeframe}`;
      const cached = cacheGet(cacheKey);
      if (cached) return cached;

      const timeframeMap = {
        '7d': "NOW() - INTERVAL '7 days'",
        '30d': "NOW() - INTERVAL '30 days'",
        '90d': "NOW() - INTERVAL '90 days'",
        '1y': "NOW() - INTERVAL '365 days'",
        all: null
      };
      const startCond = timeframeMap[timeframe] || timeframeMap['30d'];
      const timeWhere = startCond ? `AND sp.progress_date >= ${startCond}` : '';

      let groupExpr = 's.category';
      if (groupBy === 'priority') groupExpr = 's.priority';
      else if (groupBy === 'time_of_day') groupExpr = `CASE WHEN extract(hour from s.due_time) BETWEEN 5 AND 11 THEN 'Morning' WHEN extract(hour from s.due_time) BETWEEN 12 AND 16 THEN 'Afternoon' WHEN extract(hour from s.due_time) BETWEEN 17 AND 20 THEN 'Evening' ELSE 'Night' END`;
      else if (groupBy === 'day_of_week') groupExpr = `to_char(sp.progress_date, 'Day')`;

      const q = `
        SELECT ${groupExpr} as grp,
          COUNT(*)::int as total,
          COUNT(*) FILTER (WHERE sp.completed = true)::int as completed,
          AVG(sp.duration_minutes)::float as avg_duration
        FROM sadhana_progress sp
        JOIN sadhanas s ON s.id = sp.sadhana_id
        WHERE sp.user_id = $1 ${timeWhere}
        GROUP BY grp
        ORDER BY (COUNT(*) FILTER (WHERE sp.completed = true)::float / NULLIF(COUNT(*),0)) DESC NULLS LAST
      `;

      const res = await db.query(q, [userId]);
      const rows = res.rows || [];
      const mapped = rows.map(r => ({ group: String(r.grp).trim(), total: parseInt(r.total,10)||0, completed: parseInt(r.completed,10)||0, completionRate: (r.total ? Math.round((r.completed / r.total) * 1000)/10 : 0), avgDuration: Math.round((r.avg_duration||0)*10)/10 }));

      const overall = { totalPractices: mapped.reduce((s,m)=>s+m.total,0), totalCompleted: mapped.reduce((s,m)=>s+m.completed,0), overallRate: mapped.length ? Math.round((mapped.reduce((s,m)=>s+m.completed,0)/Math.max(1, mapped.reduce((s,m)=>s+m.total,0)))*1000)/10 : 0 };

      const result = { completionRates: mapped, overall };
      cacheSet(cacheKey, result, 1000 * 60 * 5);
      return result;
    } catch (e) {
      console.error('getCompletionRates error', e);
      return { completionRates: [], overall: { totalPractices:0, totalCompleted:0, overallRate:0 } };
    }
  },

  async getStreakAnalytics(userId) {
    try {
      const q = `SELECT DATE(progress_date) as day, COUNT(*) as completions FROM sadhana_progress WHERE user_id = $1 AND completed = true GROUP BY DATE(progress_date) ORDER BY DATE(progress_date) DESC`;
      const res = await db.query(q, [userId]);
      const days = res.rows.map(r => r.day.toISOString().split('T')[0]);

      // compute consecutive streaks
      let longest = 0; let current = 0; let avg = 0; let totalStreaks = 0; let streakBreaks = 0;
      const streaks = [];
      if (days.length === 0) {
        return { currentStreak: 0, longestStreak: 0, averageStreak: 0, streakDistribution: [], totalStreaks:0, streakBreaks:0 };
      }

      // transform to set for fast lookup
      const daySet = new Set(days);
      // find all streaks by scanning ascending
      const sorted = Array.from(daySet).sort();
      let seq = 0; let prev = null; const allStreakLengths = [];
      for (const d of sorted) {
        if (!prev) { seq = 1; }
        else {
          const prevDate = new Date(prev);
          const curDate = new Date(d);
          const diffDays = Math.round((curDate - prevDate) / (24*60*60*1000));
          if (diffDays === 1) seq++; else { allStreakLengths.push(seq); seq = 1; }
        }
        prev = d;
      }
      if (seq) allStreakLengths.push(seq);
      if (allStreakLengths.length) {
        longest = Math.max(...allStreakLengths);
        totalStreaks = allStreakLengths.length;
        avg = Math.round((allStreakLengths.reduce((s,n)=>s+n,0)/allStreakLengths.length)*10)/10;
        // distribution
        const distRanges = { '1-7':0, '8-14':0, '15-30':0, '30+':0 };
        for (const l of allStreakLengths) {
          if (l <=7) distRanges['1-7']++; else if (l<=14) distRanges['8-14']++; else if (l<=30) distRanges['15-30']++; else distRanges['30+']++;
        }
        const streakDistribution = [ { range: '1-7 days', count: distRanges['1-7'] }, { range: '8-14 days', count: distRanges['8-14'] }, { range: '15-30 days', count: distRanges['15-30'] }, { range: '30+ days', count: distRanges['30+'] } ];

        // current streak: count consecutive days from today backwards
        const today = new Date(); let curStreak = 0;
        for (let i=0;i<10000;i++) {
          const d = new Date(today.getTime() - (i*24*60*60*1000));
          const key = d.toISOString().split('T')[0];
          if (daySet.has(key)) curStreak++; else break;
        }

        current = curStreak;
        // streak breaks = number of gaps between streaks
        streakBreaks = Math.max(0, totalStreaks - 1);
        return { currentStreak: current, longestStreak: longest, averageStreak: avg, streakDistribution, totalStreaks, streakBreaks };
      }
      return { currentStreak: 0, longestStreak: 0, averageStreak: 0, streakDistribution: [], totalStreaks:0, streakBreaks:0 };
    } catch (e) {
      console.error('getStreakAnalytics error', e);
      return { currentStreak: 0, longestStreak: 0, averageStreak: 0, streakDistribution: [], totalStreaks:0, streakBreaks:0 };
    }
  },

  async getCommunityAverages(timeframe = '30d') {
    try {
      const cacheKey = `communityAverages_${timeframe}`;
      const cached = cacheGet(cacheKey);
      if (cached) return cached;

      const timeframeMap = {
        '7d': "NOW() - INTERVAL '7 days'",
        '30d': "NOW() - INTERVAL '30 days'",
        '90d': "NOW() - INTERVAL '90 days'",
        '1y': "NOW() - INTERVAL '365 days'",
        all: null
      };
      const startCond = timeframeMap[timeframe] || timeframeMap['30d'];
      const where = startCond ? `WHERE progress_date >= ${startCond}` : '';

      // avg completions per user per day
      const avgQ = `SELECT AVG(daily_completions)::float as avg_completions FROM (SELECT user_id, DATE(progress_date) as day, COUNT(*) FILTER (WHERE completed = true) as daily_completions FROM sadhana_progress ${where} GROUP BY user_id, DATE(progress_date)) sub`;
      const avgRes = await db.query(avgQ);

      // avg session minutes
      const durQ = `SELECT AVG(daily_total)::float as avg_session_minutes FROM (SELECT user_id, DATE(progress_date) as day, SUM(duration_minutes) as daily_total FROM sadhana_progress ${where} GROUP BY user_id, DATE(progress_date)) sub2`;
      const durRes = await db.query(durQ);

      // avg streak length approximated
      const streakQ = `SELECT AVG(user_streak) as avg_streak FROM (SELECT user_id, MAX(consec) as user_streak FROM (
        SELECT user_id, progress_date, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY progress_date) - ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY progress_date) as grp
        FROM (SELECT DISTINCT user_id, DATE(progress_date) as progress_date FROM sadhana_progress WHERE completed = true ${startCond ? `AND progress_date >= ${startCond}` : ''}) t
      ) s GROUP BY user_id) t2`;
      let avgStreak = 0;
      try { const sr = await db.query(streakQ); avgStreak = parseFloat(sr.rows[0].avg_streak) || 0; } catch (e) { avgStreak = 0; }

      // median practice frequency (per user in timeframe)
      const medianQ = `SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY user_count) as median_practice FROM (SELECT user_id, COUNT(*) as user_count FROM sadhana_progress ${where} GROUP BY user_id) sub3`;
      const medianRes = await db.query(medianQ);

      // top categories
      const catQ = `SELECT s.category, AVG(CASE WHEN sp.completed THEN 1 ELSE 0 END)::float*100 as avg_completion_rate FROM sadhana_progress sp JOIN sadhanas s ON s.id = sp.sadhana_id ${where} GROUP BY s.category ORDER BY avg_completion_rate DESC LIMIT 5`;
      const catRes = await db.query(catQ);

      const result = {
        avgCompletionsPerDay: Math.round((avgRes.rows[0].avg_completions||0)*10)/10,
        avgSessionMinutes: Math.round((durRes.rows[0].avg_session_minutes||0)*10)/10,
        avgStreak: Math.round(avgStreak*10)/10,
        medianPracticeFrequency: Math.round((medianRes.rows[0].median_practice||0)*10)/10,
        topCategories: (catRes.rows||[]).map(r=>({ category: r.category, avgCompletionRate: Math.round((r.avg_completion_rate||0)*10)/10 }))
      };

      cacheSet(cacheKey, result, 1000*60*60); // 1 hour
      return result;
    } catch (e) {
      console.error('getCommunityAverages error', e);
      return { avgCompletionsPerDay:0, avgSessionMinutes:0, avgStreak:0, medianPracticeFrequency:0, topCategories:[] };
    }
  },

  async getComparativeAnalytics(userId, timeframe = '30d') {
    try {
      const userTrends = await this.getPracticeTrends(userId, timeframe, 'daily');
      const completionRates = await this.getCompletionRates(userId, 'category', timeframe);
      const streaks = await this.getStreakAnalytics(userId);
      const community = await this.getCommunityAverages(timeframe);

      // percentile rank for completions over timeframe
      const userCountQ = await db.query(`SELECT COUNT(*) FROM (SELECT user_id, COUNT(*) as completions FROM sadhana_progress WHERE completed = true AND progress_date >= NOW() - INTERVAL '30 days' GROUP BY user_id) t WHERE completions > (SELECT COUNT(*) FROM sadhana_progress WHERE user_id = $1 AND completed = true AND progress_date >= NOW() - INTERVAL '30 days')`, [userId]);
      const totalUsersQ = await db.query(`SELECT COUNT(DISTINCT user_id) FROM sadhana_progress WHERE progress_date >= NOW() - INTERVAL '30 days'`);
      const higher = parseInt(userCountQ.rows[0].count||0,10);
      const totalUsers = parseInt(totalUsersQ.rows[0].count||0,10) || 1;
      const percentile = Math.round(((totalUsers - higher) / totalUsers) * 100);

      // percentage differences
      const userAvgCompletions = userTrends.summary.avgCompletionsPerDay || 0;
      const compsDiff = community.avgCompletionsPerDay ? Math.round(((userAvgCompletions - community.avgCompletionsPerDay)/community.avgCompletionsPerDay)*100*10)/10 : 0;

      const insights = [];
      if (compsDiff >= 20) insights.push(`You complete ${compsDiff}% more sadhanas than the community average`);
      else if (compsDiff <= -20) insights.push(`Your completion rate is ${Math.abs(compsDiff)}% below the community average`);
      if (streaks.currentStreak > streaks.averageStreak) insights.push(`You're doing well with a current streak of ${streaks.currentStreak} days`);

      return { user: { avgCompletionsPerDay: userAvgCompletions, avgSessionMinutes: userTrends.summary.avgDurationPerSession || 0, currentStreak: streaks.currentStreak, totalPractices: userTrends.summary.totalCompletions }, community, comparison: { completionsVsAvg: compsDiff, durationVsAvg: Math.round(((userTrends.summary.avgDurationPerSession - community.avgSessionMinutes)/Math.max(1,community.avgSessionMinutes))*100*10)/10, streakPercentile: percentile }, insights };
    } catch (e) {
      console.error('getComparativeAnalytics error', e);
      return { user: {}, community: {}, comparison: {}, insights: [] };
    }
  },

  async getDetailedProgressReport(userId, startDate, endDate) {
    try {
      // validate dates - assume strings YYYY-MM-DD
      const sd = startDate; const ed = endDate;
      const q = `
        SELECT sp.progress_date, sp.completed, sp.duration_minutes, s.title as sadhana_title, s.category
        FROM sadhana_progress sp
        LEFT JOIN sadhanas s ON s.id = sp.sadhana_id
        WHERE sp.user_id = $1 AND DATE(sp.progress_date) BETWEEN $2 AND $3
        ORDER BY sp.progress_date ASC
      `;
      const res = await db.query(q, [userId, sd, ed]);
      const rows = res.rows || [];
      const total = rows.length;
      const completed = rows.filter(r=>r.completed).length;
      const totalDuration = rows.reduce((s,r)=>s + (r.duration_minutes||0),0);
      const avgDuration = total ? Math.round((totalDuration/total)*10)/10 : 0;

      // category breakdown
      const catQ = `SELECT s.category, COUNT(*) as practices, COUNT(*) FILTER (WHERE sp.completed) as completed, AVG(sp.duration_minutes) as avg_duration FROM sadhana_progress sp JOIN sadhanas s ON s.id = sp.sadhana_id WHERE sp.user_id = $1 AND DATE(sp.progress_date) BETWEEN $2 AND $3 GROUP BY s.category`;
      const catRes = await db.query(catQ, [userId, sd, ed]);

      // milestones
      const msQ = `SELECT id, milestone_type, achieved_at, progress_value FROM spiritual_milestones WHERE user_id = $1 AND DATE(achieved_at) BETWEEN $2 AND $3 ORDER BY achieved_at ASC`;
      const msRes = await db.query(msQ, [userId, sd, ed]);

      const report = {
        summary: { totalPractices: total, totalCompletions: completed, completionRate: total ? Math.round((completed/total)*1000)/10 : 0, totalDuration, avgDurationPerSession: avgDuration },
        categoryBreakdown: (catRes.rows||[]).map(r=>({ category: r.category, practices: parseInt(r.practices,10), completions: parseInt(r.completed,10), completionRate: r.practices ? Math.round((r.completed/r.practices)*1000)/10 : 0, avgDuration: Math.round((r.avg_duration||0)*10)/10 })),
        milestones: (msRes.rows||[]).map(m=>({ id: m.id, name: m.milestone_type, achievedAt: m.achieved_at, milestoneType: m.milestone_type }))
      };

      // simple recommendations
      report.recommendations = [];
      if (report.summary.completionRate < 50) report.recommendations.push('Try shorter sessions to increase completion rate');
      if (report.categoryBreakdown.length) {
        const best = report.categoryBreakdown.sort((a,b)=>b.completionRate - a.completionRate)[0];
        report.recommendations.push(`Your best category is ${best.category} with ${best.completionRate}% completion`);
      }

      return report;
    } catch (e) {
      console.error('getDetailedProgressReport error', e);
      return { summary: {}, categoryBreakdown: [], milestones: [], recommendations: [] };
    }
  },

  async getPracticeHeatmap(userId, year = new Date().getFullYear()) {
    try {
      const start = `${year}-01-01`;
      const end = `${year}-12-31`;
      const q = `SELECT DATE(progress_date) as day, COUNT(*) as cnt, SUM(duration_minutes) as duration FROM sadhana_progress WHERE user_id = $1 AND DATE(progress_date) BETWEEN $2 AND $3 GROUP BY DATE(progress_date)`;
      const res = await db.query(q, [userId, start, end]);
      const map = (res.rows||[]).map(r=>({ date: r.day.toISOString().split('T')[0], count: parseInt(r.cnt,10)||0, duration: parseFloat(r.duration)||0, intensity: (r.cnt >=6 ? 'high' : r.cnt >=3 ? 'medium' : r.cnt >=1 ? 'low' : 'none') }));
      return { year, data: map, stats: { totalDays: 365, practiceDays: map.length, avgPracticesPerDay: map.length ? Math.round((map.reduce((s,m)=>s+m.count,0)/map.length)*10)/10 : 0 } };
    } catch (e) {
      console.error('getPracticeHeatmap error', e);
      return { year, data: [], stats: { totalDays: 365, practiceDays:0, avgPracticesPerDay:0 } };
    }
  },

  async getCategoryInsights(userId) {
    try {
      // analyze category performance month over month for last 6 months
      const q = `SELECT date_trunc('month', sp.progress_date) as month, s.category, COUNT(*) as practices, COUNT(*) FILTER (WHERE sp.completed) as completed FROM sadhana_progress sp JOIN sadhanas s ON s.id = sp.sadhana_id WHERE sp.user_id = $1 AND sp.progress_date >= NOW() - INTERVAL '6 months' GROUP BY month, s.category ORDER BY month ASC`;
      const res = await db.query(q, [userId]);
      const rows = res.rows || [];
      // pivot categories
      const byCategory = {};
      for (const r of rows) {
        const cat = r.category || 'unknown';
        byCategory[cat] = byCategory[cat] || { months: [], total:0, completed:0 };
        byCategory[cat].months.push({ month: r.month.toISOString().slice(0,7), practices: parseInt(r.practices,10), completed: parseInt(r.completed,10) });
        byCategory[cat].total += parseInt(r.practices,10);
        byCategory[cat].completed += parseInt(r.completed,10);
      }
      const improving = []; const declining = []; const favorites = [];
      const details = [];
      for (const [cat, info] of Object.entries(byCategory)) {
        const rates = info.months.map(m => (m.practices ? (m.completed/m.practices) : 0));
        const first = rates[0]||0; const last = rates[rates.length-1]||0;
        const trend = Math.round(((last - first)/Math.max(1, first))*100*10)/10;
        if (trend > 5) improving.push(cat);
        else if (trend < -5) declining.push(cat);
        if (info.total > 10) favorites.push(cat);
        details.push({ category: cat, status: trend>5 ? 'improving' : trend < -5 ? 'declining' : 'stable', completionRate: Math.round((info.completed/Math.max(1,info.total))*100*10)/10, trend });
      }
      return { improving, declining, favorites, recommendations: improving.map(c=>`Focus more on ${c} - it's trending up`), details };
    } catch (e) {
      console.error('getCategoryInsights error', e);
      return { improving:[], declining:[], favorites:[], recommendations:[], details:[] };
    }
  },

  calculateGrowthRate,
};

module.exports = userAnalyticsService;
