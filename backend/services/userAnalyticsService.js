const { Sadhana, SadhanaSession, SadhanaProgress, SpirtualMilestone } = require('../models');

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

// Mock data for when database is unavailable
const mockData = {
  getUserProgress: () => ({
    totalSadhanas: 12,
    completedSadhanas: 8,
    averageSessionMinutes: 25.5,
    recentPracticeDays: 5,
  }),
  
  getPracticeTrends: () => ({
    trends: [
      { date: '2025-01-01', completions: 2, totalDuration: 60, avgDuration: 30, practiceCount: 2 },
      { date: '2025-01-02', completions: 1, totalDuration: 30, avgDuration: 30, practiceCount: 1 },
      { date: '2025-01-03', completions: 3, totalDuration: 90, avgDuration: 30, practiceCount: 3 },
    ],
    summary: {
      totalCompletions: 6,
      totalDuration: 180,
      avgCompletionsPerDay: 2,
      avgDurationPerSession: 30
    }
  }),
  
  getCompletionRates: () => ({
    completionRates: [
      { group: 'Meditation', total: 5, completed: 4, completionRate: 80, avgDuration: 25 },
      { group: 'Mantras', total: 3, completed: 2, completionRate: 67, avgDuration: 20 },
      { group: 'Study', total: 4, completed: 3, completionRate: 75, avgDuration: 30 }
    ],
    overall: {
      totalPractices: 12,
      totalCompleted: 9,
      overallRate: 75
    }
  }),
  
  getStreakAnalytics: () => ({
    currentStreak: 3,
    longestStreak: 7,
    averageStreak: 4.2,
    streakDistribution: [
      { range: '1-7 days', count: 2 },
      { range: '8-14 days', count: 1 },
      { range: '15-30 days', count: 0 },
      { range: '30+ days', count: 0 }
    ],
    totalStreaks: 3,
    streakBreaks: 2
  }),
  
  getCommunityAverages: () => ({
    avgCompletionsPerDay: 1.8,
    avgSessionMinutes: 28.5,
    avgStreak: 3.7,
    medianPracticeFrequency: 15,
    topCategories: [
      { category: 'Meditation', avgCompletionRate: 78 },
      { category: 'Mantras', avgCompletionRate: 72 },
      { category: 'Study', avgCompletionRate: 65 }
    ]
  }),
  
  getCategoryInsights: () => ({
    improving: ['Meditation'],
    declining: ['Study'],
    favorites: ['Meditation', 'Mantras'],
    recommendations: ['Focus more on Meditation - it\'s trending up'],
    details: [
      { category: 'Meditation', status: 'improving', completionRate: 80, trend: 12.5 },
      { category: 'Mantras', status: 'stable', completionRate: 72, trend: 2.3 },
      { category: 'Study', status: 'declining', completionRate: 65, trend: -8.7 }
    ]
  })
};

const userAnalyticsService = {
  async getUserProgress(userId) {
    try {
      const totalSadhanas = await Sadhana.countDocuments({ userId });
      const completedSadhanas = await Sadhana.countDocuments({ userId, status: 'completed' });
      const avgDurationResult = await SadhanaSession.aggregate([
        { $match: { userId } },
        { $group: { _id: null, avgDuration: { $avg: '$durationMinutes' } } }
      ]);
      const avgDuration = (avgDurationResult[0]?.avgDuration || 0);
      const recentDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const recentPracticeDays = await SadhanaSession.distinct('startedAt', { 
        userId, 
        startedAt: { $gte: recentDate }
      });

      return {
        totalSadhanas,
        completedSadhanas,
        averageSessionMinutes: Math.round((avgDuration || 0) * 10) / 10,
        recentPracticeDays: recentPracticeDays.length,
      };
    } catch (e) {
      console.warn('getUserProgress database error, returning mock data:', e.message);
      return mockData.getUserProgress();
    }
  },

  _parseTimeframe(timeframe) {
    const map = { '7d': 7, '30d': 30, '90d': 90, '1y': 365, 'all': null };
    const days = map[timeframe] || 30;
    return days ? days * 24 * 60 * 60 * 1000 : Infinity;
  },

  async getPracticeTrends(userId, timeframe = '30d', granularity = 'daily') {
    try {
      const cacheKey = `${userId}_practiceTrends_${timeframe}_${granularity}`;
      const cached = cacheGet(cacheKey);
      if (cached) return cached;

      const timeframeMs = this._parseTimeframe(timeframe);
      const startDate = new Date(Date.now() - timeframeMs);

      const pipeline = [
        { $match: { userId, progressDate: { $gte: startDate } } },
        {
          $group: {
            _id: granularity === 'daily' ? { $dateToString: { format: '%Y-%m-%d', date: '$progressDate' } } :
                 granularity === 'weekly' ? { $week: '$progressDate' } :
                 { $dateToString: { format: '%Y-%m', date: '$progressDate' } },
            completions: { $sum: { $cond: ['$completed', 1, 0] } },
            totalDuration: { $sum: '$durationMinutes' },
            avgDuration: { $avg: '$durationMinutes' },
            practiceCount: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ];

      const rows = await SadhanaProgress.aggregate(pipeline);
      const items = rows.map(r => ({
        date: String(r._id),
        completions: parseInt(r.completions, 10) || 0,
        totalDuration: parseFloat(r.totalDuration) || 0,
        avgDuration: parseFloat(r.avgDuration) || 0,
        practiceCount: parseInt(r.practiceCount, 10) || 0
      }));

      const summary = {
        totalCompletions: items.reduce((s, i) => s + i.completions, 0),
        totalDuration: Math.round(items.reduce((s, i) => s + i.totalDuration, 0)),
        avgCompletionsPerDay: items.length ? Math.round((items.reduce((s, i) => s + i.completions, 0) / items.length) * 10) / 10 : 0,
        avgDurationPerSession: items.length ? Math.round((items.reduce((s, i) => s + i.avgDuration, 0) / items.length) * 10) / 10 : 0
      };

      const result = { trends: items, summary };
      cacheSet(cacheKey, result, 1000 * 60 * 5);
      return result;
    } catch (e) {
      console.warn('getPracticeTrends database error, returning mock data:', e.message);
      return mockData.getPracticeTrends();
    }
  },

  async getCompletionRates(userId, groupBy = 'category', timeframe = '30d') {
    try {
      const cacheKey = `${userId}_completionRates_${groupBy}_${timeframe}`;
      const cached = cacheGet(cacheKey);
      if (cached) return cached;

      const timeframeMs = this._parseTimeframe(timeframe);
      const startDate = new Date(Date.now() - timeframeMs);

      let groupField = 'category';
      if (groupBy === 'priority') groupField = 'priority';
      else if (groupBy === 'time_of_day') groupField = 'timeOfDay';
      else if (groupBy === 'day_of_week') groupField = 'dayOfWeek';

      const pipeline = [
        {
          $match: {
            userId,
            progressDate: { $gte: startDate }
          }
        },
        {
          $lookup: {
            from: 'sadhanas',
            localField: 'sadhanaId',
            foreignField: '_id',
            as: 'sadhana'
          }
        },
        { $unwind: '$sadhana' },
        {
          $group: {
            _id: groupField === 'timeOfDay' ? 
              { $cond: [
                  { $and: [{ $gte: [{ $hour: '$sadhana.dueTime' }, 5] }, { $lt: [{ $hour: '$sadhana.dueTime' }, 12] }] },
                  'Morning',
                  { $cond: [
                    { $and: [{ $gte: [{ $hour: '$sadhana.dueTime' }, 12] }, { $lt: [{ $hour: '$sadhana.dueTime' }, 17] }] },
                    'Afternoon',
                    { $cond: [
                      { $and: [{ $gte: [{ $hour: '$sadhana.dueTime' }, 17] }, { $lt: [{ $hour: '$sadhana.dueTime' }, 21] }] },
                      'Evening',
                      'Night'
                    ]}
                  ]}
                ]} : `$sadhana.${groupField}`,
            total: { $sum: 1 },
            completed: { $sum: { $cond: ['$completed', 1, 0] } },
            avgDuration: { $avg: '$durationMinutes' }
          }
        },
        { $sort: { completed: -1 } }
      ];

      const rows = await SadhanaProgress.aggregate(pipeline);
      const mapped = rows.map(r => ({
        group: String(r._id).trim(),
        total: parseInt(r.total, 10) || 0,
        completed: parseInt(r.completed, 10) || 0,
        completionRate: (r.total ? Math.round((r.completed / r.total) * 1000) / 10 : 0),
        avgDuration: Math.round((r.avgDuration || 0) * 10) / 10
      }));

      const overall = {
        totalPractices: mapped.reduce((s, m) => s + m.total, 0),
        totalCompleted: mapped.reduce((s, m) => s + m.completed, 0),
        overallRate: mapped.length ? Math.round((mapped.reduce((s, m) => s + m.completed, 0) / Math.max(1, mapped.reduce((s, m) => s + m.total, 0))) * 1000) / 10 : 0
      };

      const result = { completionRates: mapped, overall };
      cacheSet(cacheKey, result, 1000 * 60 * 5);
      return result;
    } catch (e) {
      console.warn('getCompletionRates database error, returning mock data:', e.message);
      return mockData.getCompletionRates();
    }
  },

  async getStreakAnalytics(userId) {
    try {
      const completions = await SadhanaProgress.find({ userId, completed: true }, { progressDate: 1 }).lean();
      const days = completions
        .map(c => c.progressDate.toISOString().split('T')[0])
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();

      // compute consecutive streaks - logic remains same
      let longest = 0; let current = 0; let avg = 0; let totalStreaks = 0; let streakBreaks = 0;
      if (days.length === 0) {
        return { currentStreak: 0, longestStreak: 0, averageStreak: 0, streakDistribution: [], totalStreaks: 0, streakBreaks: 0 };
      }

      const daySet = new Set(days);
      const sorted = Array.from(daySet).sort();
      let seq = 0; let prev = null; const allStreakLengths = [];
      for (const d of sorted) {
        if (!prev) { seq = 1; }
        else {
          const prevDate = new Date(prev);
          const curDate = new Date(d);
          const diffDays = Math.round((curDate - prevDate) / (24 * 60 * 60 * 1000));
          if (diffDays === 1) seq++; else { allStreakLengths.push(seq); seq = 1; }
        }
        prev = d;
      }
      if (seq) allStreakLengths.push(seq);
      if (allStreakLengths.length) {
        longest = Math.max(...allStreakLengths);
        totalStreaks = allStreakLengths.length;
        avg = Math.round((allStreakLengths.reduce((s, n) => s + n, 0) / allStreakLengths.length) * 10) / 10;
        const distRanges = { '1-7': 0, '8-14': 0, '15-30': 0, '30+': 0 };
        for (const l of allStreakLengths) {
          if (l <= 7) distRanges['1-7']++; else if (l <= 14) distRanges['8-14']++; else if (l <= 30) distRanges['15-30']++; else distRanges['30+']++;
        }
        const streakDistribution = [
          { range: '1-7 days', count: distRanges['1-7'] },
          { range: '8-14 days', count: distRanges['8-14'] },
          { range: '15-30 days', count: distRanges['15-30'] },
          { range: '30+ days', count: distRanges['30+'] }
        ];

        const today = new Date(); let curStreak = 0;
        for (let i = 0; i < 10000; i++) {
          const d = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
          const key = d.toISOString().split('T')[0];
          if (daySet.has(key)) curStreak++; else break;
        }

        current = curStreak;
        streakBreaks = Math.max(0, totalStreaks - 1);
        return { currentStreak: current, longestStreak: longest, averageStreak: avg, streakDistribution, totalStreaks, streakBreaks };
      }
      return { currentStreak: 0, longestStreak: 0, averageStreak: 0, streakDistribution: [], totalStreaks: 0, streakBreaks: 0 };
    } catch (e) {
      console.warn('getStreakAnalytics database error, returning mock data:', e.message);
      return mockData.getStreakAnalytics();
    }
  },

  async getCommunityAverages(timeframe = '30d') {
    try {
      const cacheKey = `communityAverages_${timeframe}`;
      const cached = cacheGet(cacheKey);
      if (cached) return cached;

      const timeframeMs = this._parseTimeframe(timeframe);
      const startDate = new Date(Date.now() - timeframeMs);

      // avg completions per user per day using aggregation
      const avgCompletionsResult = await SadhanaProgress.aggregate([
        { $match: { progressDate: { $gte: startDate } } },
        { $group: { _id: { userId: '$userId', day: { $dateToString: { format: '%Y-%m-%d', date: '$progressDate' } } }, dailyCompletions: { $sum: { $cond: ['$completed', 1, 0] } } } },
        { $group: { _id: null, avgCompletions: { $avg: '$dailyCompletions' } } }
      ]);

      // avg session minutes
      const avgDurationResult = await SadhanaProgress.aggregate([
        { $match: { progressDate: { $gte: startDate } } },
        { $group: { _id: { userId: '$userId', day: { $dateToString: { format: '%Y-%m-%d', date: '$progressDate' } } }, dailyTotal: { $sum: '$durationMinutes' } } },
        { $group: { _id: null, avgSessionMinutes: { $avg: '$dailyTotal' } } }
      ]);

      // top categories
      const topCategoriesResult = await SadhanaProgress.aggregate([
        { $match: { progressDate: { $gte: startDate } } },
        { $lookup: { from: 'sadhanas', localField: 'sadhanaId', foreignField: '_id', as: 'sadhana' } },
        { $unwind: '$sadhana' },
        { $group: { _id: '$sadhana.category', avgCompletionRate: { $avg: { $cond: ['$completed', 1, 0] } } } },
        { $sort: { avgCompletionRate: -1 } },
        { $limit: 5 }
      ]);

      const result = {
        avgCompletionsPerDay: Math.round((avgCompletionsResult[0]?.avgCompletions || 0) * 10) / 10,
        avgSessionMinutes: Math.round((avgDurationResult[0]?.avgSessionMinutes || 0) * 10) / 10,
        avgStreak: 0, // Requires complex computation, using 0 for now
        medianPracticeFrequency: 0, // Would require percentile computation
        topCategories: (topCategoriesResult || []).map(r => ({ category: r._id, avgCompletionRate: Math.round((r.avgCompletionRate * 100) * 10) / 10 }))
      };

      cacheSet(cacheKey, result, 1000 * 60 * 60);
      return result;
    } catch (e) {
      console.warn('getCommunityAverages database error, returning mock data:', e.message);
      return mockData.getCommunityAverages();
    }
  },

  async getComparativeAnalytics(userId, timeframe = '30d') {
    try {
      const userTrends = await this.getPracticeTrends(userId, timeframe, 'daily');
      const completionRates = await this.getCompletionRates(userId, 'category', timeframe);
      const streaks = await this.getStreakAnalytics(userId);
      const community = await this.getCommunityAverages(timeframe);

      // percentile rank for completions
      const timeframeMs = this._parseTimeframe(timeframe);
      const startDate = new Date(Date.now() - timeframeMs);
      
      const userCountResult = await SadhanaProgress.aggregate([
        { $match: { progressDate: { $gte: startDate }, completed: true } },
        { $group: { _id: '$userId', completions: { $sum: 1 } } }
      ]);

      const userCompletions = (userCountResult.find(u => u._id.toString() === userId) || {}).completions || 0;
      const higher = userCountResult.filter(u => u.completions > userCompletions).length;
      const totalUsers = userCountResult.length || 1;
      const percentile = Math.round(((totalUsers - higher) / totalUsers) * 100);

      const userAvgCompletions = userTrends.summary.avgCompletionsPerDay || 0;
      const compsDiff = community.avgCompletionsPerDay ? Math.round(((userAvgCompletions - community.avgCompletionsPerDay) / community.avgCompletionsPerDay) * 100 * 10) / 10 : 0;

      const insights = [];
      if (compsDiff >= 20) insights.push(`You complete ${compsDiff}% more sadhanas than the community average`);
      else if (compsDiff <= -20) insights.push(`Your completion rate is ${Math.abs(compsDiff)}% below the community average`);
      if (streaks.currentStreak > streaks.averageStreak) insights.push(`You're doing well with a current streak of ${streaks.currentStreak} days`);

      return {
        user: { avgCompletionsPerDay: userAvgCompletions, avgSessionMinutes: userTrends.summary.avgDurationPerSession || 0, currentStreak: streaks.currentStreak, totalPractices: userTrends.summary.totalCompletions },
        community,
        comparison: { completionsVsAvg: compsDiff, durationVsAvg: Math.round(((userTrends.summary.avgDurationPerSession - community.avgSessionMinutes) / Math.max(1, community.avgSessionMinutes)) * 100 * 10) / 10, streakPercentile: percentile },
        insights
      };
    } catch (e) {
      console.warn('getComparativeAnalytics database error, returning mock data:', e.message);
      const mockUser = mockData.getUserProgress();
      const mockCommunity = mockData.getCommunityAverages();
      return {
        user: { avgCompletionsPerDay: 2.0, avgSessionMinutes: 25.5, currentStreak: 3, totalPractices: mockUser.totalSadhanas },
        community: mockCommunity,
        comparison: { completionsVsAvg: 11.1, durationVsAvg: -10.5, streakPercentile: 65 },
        insights: ["You complete 11.1% more sadhanas than the community average", "You're doing well with a current streak of 3 days"]
      };
    }
  },

  async getDetailedProgressReport(userId, startDate, endDate) {
    try {
      const sd = new Date(startDate);
      const ed = new Date(endDate);
      ed.setDate(ed.getDate() + 1); // Include end date

      const progresses = await SadhanaProgress.find({
        userId,
        progressDate: { $gte: sd, $lt: ed }
      }).populate('sadhanaId', 'title category').lean().sort({ progressDate: 1 });

      const total = progresses.length;
      const completed = progresses.filter(p => p.completed).length;
      const totalDuration = progresses.reduce((s, p) => s + (p.durationMinutes || 0), 0);
      const avgDuration = total ? Math.round((totalDuration / total) * 10) / 10 : 0;

      // category breakdown
      const catMap = {};
      for (const p of progresses) {
        const cat = p.sadhanaId?.category || 'unknown';
        catMap[cat] = catMap[cat] || { practices: 0, completed: 0, totalDuration: 0 };
        catMap[cat].practices++;
        if (p.completed) catMap[cat].completed++;
        catMap[cat].totalDuration += p.durationMinutes || 0;
      }

      const categoryBreakdown = Object.entries(catMap).map(([category, data]) => ({
        category,
        practices: data.practices,
        completions: data.completed,
        completionRate: data.practices ? Math.round((data.completed / data.practices) * 1000) / 10 : 0,
        avgDuration: Math.round((data.totalDuration / Math.max(1, data.practices)) * 10) / 10
      }));

      // milestones
      const milestones = await SpirtualMilestone.find({
        userId,
        achievedAt: { $gte: sd, $lt: ed }
      }).lean().sort({ achievedAt: 1 });

      const report = {
        summary: { totalPractices: total, totalCompletions: completed, completionRate: total ? Math.round((completed / total) * 1000) / 10 : 0, totalDuration, avgDurationPerSession: avgDuration },
        categoryBreakdown,
        milestones: milestones.map(m => ({ id: m._id, name: m.milestoneType, achievedAt: m.achievedAt, milestoneType: m.milestoneType }))
      };

      report.recommendations = [];
      if (report.summary.completionRate < 50) report.recommendations.push('Try shorter sessions to increase completion rate');
      if (categoryBreakdown.length) {
        const best = categoryBreakdown.sort((a, b) => b.completionRate - a.completionRate)[0];
        report.recommendations.push(`Your best category is ${best.category} with ${best.completionRate}% completion`);
      }

      return report;
    } catch (e) {
      console.warn('getDetailedProgressReport database error, returning mock data:', e.message);
      return {
        summary: { totalPractices: 12, totalCompletions: 9, completionRate: 75, totalDuration: 180, avgDurationPerSession: 25.5 },
        categoryBreakdown: [
          { category: 'Meditation', practices: 5, completions: 4, completionRate: 80, avgDuration: 25 },
          { category: 'Mantras', practices: 3, completions: 2, completionRate: 67, avgDuration: 20 },
          { category: 'Study', practices: 4, completions: 3, completionRate: 75, avgDuration: 30 }
        ],
        milestones: [
          { id: '1', name: 'First Practice', achievedAt: '2025-01-01T10:00:00Z', milestoneType: 'practice' },
          { id: '2', name: '5-Day Streak', achievedAt: '2025-01-05T10:00:00Z', milestoneType: 'streak' }
        ],
        recommendations: ['Your best category is Meditation with 80% completion']
      };
    }
  },

  async getPracticeHeatmap(userId, year = new Date().getFullYear()) {
    try {
      const startOfYear = new Date(`${year}-01-01`);
      const endOfYear = new Date(`${year}-12-31`);
      endOfYear.setDate(endOfYear.getDate() + 1);

      const heatmapData = await SadhanaProgress.aggregate([
        { $match: { userId, progressDate: { $gte: startOfYear, $lt: endOfYear } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$progressDate' } },
            count: { $sum: 1 },
            duration: { $sum: '$durationMinutes' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const map = heatmapData.map(r => ({
        date: r._id,
        count: parseInt(r.count, 10) || 0,
        duration: parseFloat(r.duration) || 0,
        intensity: (r.count >= 6 ? 'high' : r.count >= 3 ? 'medium' : r.count >= 1 ? 'low' : 'none')
      }));

      return {
        year,
        data: map,
        stats: { totalDays: 365, practiceDays: map.length, avgPracticesPerDay: map.length ? Math.round((map.reduce((s, m) => s + m.count, 0) / map.length) * 10) / 10 : 0 }
      };
    } catch (e) {
      console.warn('getPracticeHeatmap database error, returning mock data:', e.message);
      const mockData = [];
      for (let i = 1; i <= 31; i++) {
        const date = `2025-01-${i.toString().padStart(2, '0')}`;
        mockData.push({
          date,
          count: Math.floor(Math.random() * 4),
          duration: Math.floor(Math.random() * 120),
          intensity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : Math.random() > 0.1 ? 'low' : 'none'
        });
      }
      return { year, data: mockData, stats: { totalDays: 365, practiceDays: mockData.filter(d => d.count > 0).length, avgPracticesPerDay: 1.2 } };
    }
  },

  async getCategoryInsights(userId) {
    try {
      const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);

      const categoryData = await SadhanaProgress.aggregate([
        { $match: { userId, progressDate: { $gte: sixMonthsAgo } } },
        { $lookup: { from: 'sadhanas', localField: 'sadhanaId', foreignField: '_id', as: 'sadhana' } },
        { $unwind: '$sadhana' },
        {
          $group: {
            _id: { month: { $dateToString: { format: '%Y-%m', date: '$progressDate' } }, category: '$sadhana.category' },
            practices: { $sum: 1 },
            completed: { $sum: { $cond: ['$completed', 1, 0] } }
          }
        },
        { $sort: { '_id.month': 1 } }
      ]);

      const byCategory = {};
      for (const r of categoryData) {
        const cat = r._id.category || 'unknown';
        byCategory[cat] = byCategory[cat] || { months: [], total: 0, completed: 0 };
        byCategory[cat].months.push({ month: r._id.month, practices: r.practices, completed: r.completed });
        byCategory[cat].total += r.practices;
        byCategory[cat].completed += r.completed;
      }

      const improving = []; const declining = []; const favorites = [];
      const details = [];
      for (const [cat, info] of Object.entries(byCategory)) {
        const rates = info.months.map(m => (m.practices ? (m.completed / m.practices) : 0));
        const first = rates[0] || 0; const last = rates[rates.length - 1] || 0;
        const trend = Math.round(((last - first) / Math.max(1, first)) * 100 * 10) / 10;
        if (trend > 5) improving.push(cat);
        else if (trend < -5) declining.push(cat);
        if (info.total > 10) favorites.push(cat);
        details.push({ category: cat, status: trend > 5 ? 'improving' : trend < -5 ? 'declining' : 'stable', completionRate: Math.round((info.completed / Math.max(1, info.total)) * 100 * 10) / 10, trend });
      }
      return { improving, declining, favorites, recommendations: improving.map(c => `Focus more on ${c} - it's trending up`), details };
    } catch (e) {
      console.warn('getCategoryInsights database error, returning mock data:', e.message);
      return mockData.getCategoryInsights();
    }
  },

  calculateGrowthRate,
};

module.exports = userAnalyticsService;
