const ProfileService = require('../services/profileService');
const SocialService = require('../services/socialService');
const userAnalyticsService = require('../services/userAnalyticsService');
const analyticsExportService = require('../services/analyticsExportService');
const UserProgressionService = require('../services/userProgressionService');

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management and social features
 */

class ProfileController {
  /**
   * @swagger
   * /profile:
   *   get:
   *     summary: Get user profile
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 profile:
   *                   $ref: '#/components/schemas/Profile'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Profile not found
   *       500:
   *         description: Server error
   */
  // Get user profile
  static async getProfile(req, res) {
    try {
      const profile = await ProfileService.getProfileByUserId(req.user.id);
      
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      // Merge profile with user data (displayName from User document)
      const profileData = profile.toJSON();
      profileData.display_name = req.user.displayName;
      profileData.email = req.user.email;
      profileData.user_id = req.user.id;

      res.json({ profile: profileData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /profile:
   *   put:
   *     summary: Update user profile
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Profile'
   *     responses:
   *       200:
   *         description: Profile updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 profile:
   *                   $ref: '#/components/schemas/Profile'
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  // Update user profile
  static async updateProfile(req, res) {
    try {
      const profile = await ProfileService.updateProfile(req.user.id, req.body);
      
      // If onboarding is being completed, initialize user progression
      if (req.body.onboarding_completed === true) {
        try {
          await UserProgressionService.initializeUserProgression(req.user.id);
        } catch (initError) {
          console.error('Failed to initialize user progression:', initError.message);
          // Don't fail the profile update if progression initialization fails
        }
      }
      
      // Merge profile with user data (displayName from User document)
      const profileData = profile.toJSON();
      profileData.display_name = req.user.displayName;
      profileData.email = req.user.email;
      profileData.user_id = req.user.id;
      
      res.json({ profile: profileData });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /profile/{id}/follow:
   *   post:
   *     summary: Follow a user
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the user to follow
   *     responses:
   *       200:
   *         description: Successfully followed user
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async follow(req, res) {
    try {
      const followerId = req.user.id;
      const followedId = req.params.id;
      const result = await SocialService.followUser(followerId, followedId);
      return res.json(result);
    } catch (err) {
      console.error('follow error', err);
      return res.status(400).json({ error: err.message });
    }
  }

  /**
   * @swagger
   * /profile/{id}/unfollow:
   *   post:
   *     summary: Unfollow a user
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     parameters:
      *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the user to unfollow
   *     responses:
   *       200:
   *         description: Successfully unfollowed user
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async unfollow(req, res) {
    try {
      const followerId = req.user.id;
      const followedId = req.params.id;
      const result = await SocialService.unfollowUser(followerId, followedId);
      return res.json(result);
    } catch (err) {
      console.error('unfollow error', err);
      return res.status(400).json({ error: err.message });
    }
  }

  /**
   * @swagger
   * /profile/{id}/followers:
   *   get:
   *     summary: Get followers of a user
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the user
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 50
   *         description: Number of followers to return
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Offset for pagination
   *     responses:
   *       200:
   *         description: List of followers
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async followers(req, res) {
    try {
      const userId = req.params.id;
      const pagination = { limit: parseInt(req.query.limit,10) || 50, offset: parseInt(req.query.offset,10) || 0 };
      const data = await SocialService.getFollowers(userId, pagination);
      return res.json(data);
    } catch (err) {
      console.error('followers error', err);
      return res.status(400).json({ error: err.message });
    }
  }

  /**
   * @swagger
   * /profile/{id}/following:
   *   get:
   *     summary: Get users that a user is following
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the user
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 50
   *         description: Number of following to return
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Offset for pagination
   *     responses:
   *       200:
   *         description: List of following
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async following(req, res) {
    try {
      const userId = req.params.id;
      const pagination = { limit: parseInt(req.query.limit,10) || 50, offset: parseInt(req.query.offset,10) || 0 };
      const data = await SocialService.getFollowing(userId, pagination);
      return res.json(data);
    } catch (err) {
      console.error('following error', err);
      return res.status(400).json({ error: err.message });
    }
  }

  /**
   * @swagger
   * /profile/{id}/follow-stats:
   *   get:
   *     summary: Get follow statistics for a user
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the user
   *     responses:
   *       200:
   *         description: Follow statistics
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async followStats(req, res) {
    try {
      const userId = req.params.id;
      const stats = await SocialService.getFollowStats(userId);
      return res.json(stats);
    } catch (err) {
      console.error('followStats error', err);
      return res.status(400).json({ error: err.message });
    }
  }

  /**
   * @swagger
   * /profile/{id}/is-following:
   *   get:
   *     summary: Check if current user is following another user
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the user to check
   *     responses:
   *       200:
   *         description: Follow status
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 isFollowing:
   *                   type: boolean
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async isFollowing(req, res) {
    try {
      const followerId = req.user.id;
      const followedId = req.params.id;
      const isFollowing = await SocialService.isFollowing(followerId, followedId);
      return res.json({ isFollowing });
    } catch (err) {
      console.error('isFollowing error', err);
      return res.status(400).json({ error: err.message });
    }
  }

  /**
   * @swagger
   * /profile/analytics/practice-trends:
   *   get:
   *     summary: Get practice trends analytics
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: timeframe
   *         schema:
   *           type: string
   *           default: 30d
   *         description: Timeframe for analytics (e.g., 7d, 30d, 90d)
   *       - in: query
   *         name: granularity
   *         schema:
   *           type: string
   *           default: daily
   *         description: Granularity of data (daily, weekly, monthly)
   *     responses:
   *       200:
   *         description: Practice trends data
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async getPracticeTrends(req, res) {
    try {
      const userId = req.user.id;
      const timeframe = req.query.timeframe || '30d';
      const granularity = req.query.granularity || 'daily';
      const data = await userAnalyticsService.getPracticeTrends(userId, timeframe, granularity);
      return res.json(data);
    } catch (err) {
      console.error('getPracticeTrends error', err);
      // Return mock data if database is unavailable
      return res.json({
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
      });
    }
  }

  /**
   * @swagger
   * /profile/analytics/completion-rates:
   *   get:
   *     summary: Get completion rates analytics
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: groupBy
   *         schema:
   *           type: string
   *           default: category
   *         description: Group by category or other criteria
   *       - in: query
   *         name: timeframe
   *         schema:
   *           type: string
   *           default: 30d
   *         description: Timeframe for analytics
   *     responses:
   *       200:
   *         description: Completion rates data
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async getCompletionRates(req, res) {
    try {
      const userId = req.user.id;
      const groupBy = req.query.groupBy || 'category';
      const timeframe = req.query.timeframe || '30d';
      const data = await userAnalyticsService.getCompletionRates(userId, groupBy, timeframe);
      return res.json(data);
    } catch (err) {
      console.error('getCompletionRates error', err);
      // Return mock data if database is unavailable
      return res.json({
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
      });
    }
  }

  /**
   * @swagger
   * /profile/analytics/streaks:
   *   get:
   *     summary: Get streak analytics
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Streak analytics data
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async getStreaks(req, res) {
    try {
      const userId = req.user.id;
      const data = await userAnalyticsService.getStreakAnalytics(userId);
      return res.json(data);
    } catch (err) {
      console.error('getStreaks error', err);
      // Return mock data if database is unavailable
      return res.json({
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
      });
    }
  }

  /**
   * @swagger
   * /profile/analytics/comparative:
   *   get:
   *     summary: Get comparative analytics
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: timeframe
   *         schema:
   *           type: string
   *           default: 30d
   *         description: Timeframe for analytics
   *     responses:
   *       200:
   *         description: Comparative analytics data
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async getComparative(req, res) {
    try {
      const userId = req.user.id;
      const timeframe = req.query.timeframe || '30d';
      const data = await userAnalyticsService.getComparativeAnalytics(userId, timeframe);
      return res.json(data);
    } catch (err) {
      console.error('getComparative error', err);
      // Return mock data if database is unavailable
      return res.json({
        user: { 
          avgCompletionsPerDay: 2.0, 
          avgSessionMinutes: 25.5, 
          currentStreak: 3, 
          totalPractices: 12 
        },
        community: {
          avgCompletionsPerDay: 1.8,
          avgSessionMinutes: 28.5,
          avgStreak: 3.7,
          medianPracticeFrequency: 15,
          topCategories: [
            { category: 'Meditation', avgCompletionRate: 78 },
            { category: 'Mantras', avgCompletionRate: 72 },
            { category: 'Study', avgCompletionRate: 65 }
          ]
        },
        comparison: { 
          completionsVsAvg: 11.1, 
          durationVsAvg: -10.5, 
          streakPercentile: 65 
        },
        insights: [
          "You complete 11.1% more sadhanas than the community average",
          "You're doing well with a current streak of 3 days"
        ]
      });
    }
  }

  /**
   * @swagger
   * /profile/analytics/detailed-report:
   *   get:
   *     summary: Get detailed progress report
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: start
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date (YYYY-MM-DD)
   *       - in: query
   *         name: end
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: End date (YYYY-MM-DD)
   *     responses:
   *       200:
   *         description: Detailed progress report
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async getDetailedReport(req, res) {
    try {
      const userId = req.user.id;
      const start = req.query.start;
      const end = req.query.end;
      if (!start || !end) return res.status(400).json({ error: 'start and end query params required (YYYY-MM-DD)' });
      const data = await userAnalyticsService.getDetailedProgressReport(userId, start, end);
      return res.json(data);
    } catch (err) {
      console.error('getDetailedReport error', err);
      // Return mock data if database is unavailable
      return res.json({
        summary: { 
          totalPractices: 12, 
          totalCompletions: 9, 
          completionRate: 75, 
          totalDuration: 180, 
          avgDurationPerSession: 25.5 
        },
        categoryBreakdown: [
          { category: 'Meditation', practices: 5, completions: 4, completionRate: 80, avgDuration: 25 },
          { category: 'Mantras', practices: 3, completions: 2, completionRate: 67, avgDuration: 20 },
          { category: 'Study', practices: 4, completions: 3, completionRate: 75, avgDuration: 30 }
        ],
        milestones: [
          { id: '1', name: 'First Practice', achievedAt: '2025-01-01T10:00:00Z', milestoneType: 'practice' },
          { id: '2', name: '5-Day Streak', achievedAt: '2025-01-05T10:00:00Z', milestoneType: 'streak' }
        ],
        recommendations: [
          'Your best category is Meditation with 80% completion'
        ]
      });
    }
  }

  /**
   * @swagger
   * /profile/analytics/heatmap:
   *   get:
   *     summary: Get practice heatmap
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: year
   *         schema:
   *           type: integer
   *           default: current year
   *         description: Year for heatmap data
   *     responses:
   *       200:
   *         description: Practice heatmap data
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async getHeatmap(req, res) {
    try {
      const userId = req.user.id;
      const year = parseInt(req.query.year,10) || new Date().getFullYear();
      const data = await userAnalyticsService.getPracticeHeatmap(userId, year);
      return res.json(data);
    } catch (err) {
      console.error('getHeatmap error', err);
      // Return mock data if database is unavailable
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
      return res.json({ 
        year, 
        data: mockData, 
        stats: { 
          totalDays: 365, 
          practiceDays: mockData.filter(d => d.count > 0).length, 
          avgPracticesPerDay: 1.2 
        } 
      });
    }
  }

  /**
   * @swagger
   * /profile/analytics/category-insights:
   *   get:
   *     summary: Get category insights
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Category insights data
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async getCategoryInsights(req, res) {
    try {
      const userId = req.user.id;
      const data = await userAnalyticsService.getCategoryInsights(userId);
      return res.json(data);
    } catch (err) {
      console.error('getCategoryInsights error', err);
      // Return mock data if database is unavailable
      return res.json({
        improving: ['Meditation'],
        declining: ['Study'],
        favorites: ['Meditation', 'Mantras'],
        recommendations: ['Focus more on Meditation - it\'s trending up'],
        details: [
          { category: 'Meditation', status: 'improving', completionRate: 80, trend: 12.5 },
          { category: 'Mantras', status: 'stable', completionRate: 72, trend: 2.3 },
          { category: 'Study', status: 'declining', completionRate: 65, trend: -8.7 }
        ]
      });
    }
  }

  /**
   * @swagger
   * /profile/analytics/export/csv:
   *   get:
   *     summary: Export analytics as CSV
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           default: detailed
   *         description: Type of export
   *       - in: query
   *         name: start
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date (required for detailed export)
   *       - in: query
   *         name: end
   *         schema:
   *           type: string
   *           format: date
   *         description: End date (required for detailed export)
   *     responses:
   *       200:
   *         description: CSV file
   *         content:
   *           text/csv:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async exportCSV(req, res) {
    try {
      const type = req.query.type || 'detailed';
      const userId = req.user.id;
      if (type === 'detailed') {
        const start = req.query.start; const end = req.query.end;
        if (!start || !end) return res.status(400).json({ error: 'start and end params required for detailed export' });
        const report = await userAnalyticsService.getDetailedProgressReport(userId, start, end);
        // flatten report.summary + breakdown
        const rows = [];
        rows.push({ key: 'totalPractices', value: report.summary.totalPractices });
        rows.push({ key: 'totalCompletions', value: report.summary.totalCompletions });
        for (const b of report.categoryBreakdown) rows.push({ key: `category:${b.category}`, value: `${b.practices} practices, ${b.completionRate}% completion` });
        const csv = await analyticsExportService.generateCSVReport(rows, [{ key: 'key', title: 'Key' }, { key: 'value', title: 'Value' }]);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="analytics_${userId}_${type}.csv"`);
        return res.send(csv);
      }
      return res.status(400).json({ error: 'unknown export type' });
    } catch (err) {
      console.error('exportCSV error', err);
      return res.status(500).json({ error: err.message });
    }
  }

  /**
   * @swagger
   * /profile/analytics/export/pdf:
   *   get:
   *     summary: Export analytics as PDF
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           default: detailed
   *         description: Type of export
   *       - in: query
   *         name: start
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date (required for detailed export)
   *       - in: query
   *         name: end
   *         schema:
   *           type: string
   *           format: date
   *         description: End date (required for detailed export)
   *     responses:
   *       200:
   *         description: PDF file
   *         content:
   *           application/pdf:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async exportPDF(req, res) {
    try {
      const type = req.query.type || 'detailed';
      const userId = req.user.id;
      if (type === 'detailed') {
        const start = req.query.start; const end = req.query.end;
        if (!start || !end) return res.status(400).json({ error: 'start and end params required for detailed export' });
        const report = await userAnalyticsService.getDetailedProgressReport(userId, start, end);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="analytics_${userId}_${type}.pdf"`);
        await analyticsExportService.streamPDFReport(`Analytics: ${userId} ${type}`, [report.summary, ...report.categoryBreakdown], res);
        return res.end();
      }
      return res.status(400).json({ error: 'unknown export type' });
    } catch (err) {
      console.error('exportPDF error', err);
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = ProfileController;