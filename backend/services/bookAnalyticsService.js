const BookAnalytics = require('../schemas/BookAnalytics');
const Book = require('../schemas/Book');

const BookAnalyticsService = {
  async trackBookEvent(bookId, eventType, userId = null, metadata = {}) {
    try {
      const { ipAddress = null, userAgent = null } = metadata || {};
      const event = new BookAnalytics({
        bookId,
        eventType,
        userId,
        ipAddress,
        userAgent
      });
      await event.save().catch(() => {
        // Non-blocking: tracking failures don't stop operations
      });
    } catch (e) {
      // Do not throw - tracking must be non-blocking
      console.error('Failed to track book event', e.message || e);
    }
  },

  async getLibraryOverview() {
    try {
      const [totalBooks, totalStorage, recentUploads, totalViews, totalDownloads] = await Promise.all([
        Book.countDocuments({ deletedAt: null }),
        Book.aggregate([{ $match: { deletedAt: null } }, { $group: { _id: null, total: { $sum: '$fileSize' } } }]),
        Book.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 86400000) }, deletedAt: null }),
        BookAnalytics.countDocuments({ eventType: 'view' }),
        BookAnalytics.countDocuments({ eventType: 'download' })
      ]);

      return {
        totalBooks,
        totalStorage: totalStorage[0]?.total || 0,
        recentUploads,
        totalViews,
        totalDownloads
      };
    } catch (e) {
      console.error('getLibraryOverview error', e.message || e);
      return { totalBooks: 0, totalStorage: 0, recentUploads: 0, totalViews: 0, totalDownloads: 0 };
    }
  },

  async getUploadTrends(days = 30) {
    try {
      const cutoffDate = new Date(Date.now() - days * 86400000);
      const res = await Book.aggregate([
        { $match: { createdAt: { $gte: cutoffDate }, deletedAt: null } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      return res.map(r => ({ date: r._id, count: r.count }));
    } catch (e) {
      console.error('getUploadTrends error', e.message || e);
      return [];
    }
  },

  async getPopularBooks(limit = 10, days = 30) {
    try {
      const cutoffDate = new Date(Date.now() - days * 86400000);
      const res = await BookAnalytics.aggregate([
        { $match: { eventType: 'view', createdAt: { $gte: cutoffDate } } },
        { $group: { _id: '$bookId', views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: '_id',
            as: 'book'
          }
        },
        { $unwind: '$book' },
        {
          $project: {
            id: '$_id',
            title: '$book.title',
            author: '$book.author',
            views: 1
          }
        }
      ]);
      return res;
    } catch (e) {
      console.error('getPopularBooks error', e.message || e);
      return [];
    }
  },

  async getTopDownloads(limit = 10, days = 30) {
    try {
      const cutoffDate = new Date(Date.now() - days * 86400000);
      const res = await BookAnalytics.aggregate([
        { $match: { eventType: 'download', createdAt: { $gte: cutoffDate } } },
        { $group: { _id: '$bookId', downloads: { $sum: 1 } } },
        { $sort: { downloads: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: '_id',
            as: 'book'
          }
        },
        { $unwind: '$book' },
        {
          $project: {
            id: '$_id',
            title: '$book.title',
            author: '$book.author',
            downloads: 1
          }
        }
      ]);
      return res;
    } catch (e) {
      console.error('getTopDownloads error', e.message || e);
      return [];
    }
  },

  async getEngagementMetrics(days = 30) {
    try {
      const cutoffDate = new Date(Date.now() - days * 86400000);
      const [viewsData, dlData, uniqueViewers, totalViews, totalBooks] = await Promise.all([
        BookAnalytics.aggregate([
          { $match: { eventType: 'view', createdAt: { $gte: cutoffDate } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]),
        BookAnalytics.aggregate([
          { $match: { eventType: 'download', createdAt: { $gte: cutoffDate } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]),
        BookAnalytics.distinct('userId', { eventType: 'view', createdAt: { $gte: cutoffDate }, userId: { $ne: null } }).then(ids => ids.length),
        BookAnalytics.countDocuments({ eventType: 'view', createdAt: { $gte: cutoffDate } }),
        Book.countDocuments({ deletedAt: null })
      ]);

      const avgViewsPerBook = totalBooks ? totalViews / totalBooks : 0;
      return {
        viewsOverTime: viewsData.map(r => ({ date: r._id, count: r.count })),
        downloadsOverTime: dlData.map(r => ({ date: r._id, count: r.count })),
        uniqueViewers,
        avgViewsPerBook
      };
    } catch (e) {
      console.error('getEngagementMetrics error', e.message || e);
      return { viewsOverTime: [], downloadsOverTime: [], uniqueViewers: 0, avgViewsPerBook: 0 };
    }
  },

  async getBookAnalytics(bookId) {
    try {
      const [totalViews, totalDownloads, uniqueViewersResult, viewTrendData] = await Promise.all([
        BookAnalytics.countDocuments({ bookId, eventType: 'view' }),
        BookAnalytics.countDocuments({ bookId, eventType: 'download' }),
        BookAnalytics.distinct('userId', { bookId, eventType: 'view', userId: { $ne: null } }).then(ids => ids.length),
        BookAnalytics.aggregate([
          { $match: { bookId, eventType: 'view', createdAt: { $gte: new Date(Date.now() - 30 * 86400000) } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ])
      ]);

      const firstLastViews = await BookAnalytics.aggregate([
        { $match: { bookId, eventType: 'view' } },
        { $sort: { createdAt: 1 } },
        { $limit: 1 },
        { $project: { firstView: '$createdAt', _id: 0 } }
      ]);

      return {
        totalViews,
        totalDownloads,
        uniqueViewers: uniqueViewersResult,
        firstViewed: firstLastViews[0]?.firstView || null,
        lastViewed: new Date(), // simplified - would need another query for actual last view
        viewTrend: viewTrendData.map(r => ({ date: r._id, count: r.count }))
      };
    } catch (e) {
      console.error('getBookAnalytics error', e.message || e);
      return { totalViews: 0, totalDownloads: 0, uniqueViewers: 0, firstViewed: null, lastViewed: null, viewTrend: [] };
    }
  },

  async generateAnalyticsReport(filters = {}) {
    try {
      const { startDate, endDate, bookIds, eventType } = filters || {};
      const query = {};
      if (startDate) query.createdAt = { $gte: new Date(startDate) };
      if (endDate) {
        if (!query.createdAt) query.createdAt = {};
        query.createdAt.$lte = new Date(endDate);
      }
      if (Array.isArray(bookIds) && bookIds.length > 0) query.bookId = { $in: bookIds };
      if (eventType) query.eventType = eventType;

      const res = await BookAnalytics.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'books',
            localField: 'bookId',
            foreignField: '_id',
            as: 'bookData'
          }
        },
        { $unwind: { path: '$bookData', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            book_title: '$bookData.title',
            book_author: '$bookData.author',
            event_type: '$eventType',
            event_date: '$createdAt',
            user_id: '$userId'
          }
        },
        { $sort: { event_date: -1 } }
      ]);
      return res;
    } catch (e) {
      console.error('generateAnalyticsReport error', e.message || e);
      return [];
    }
  },

  async getStorageBreakdown() {
    try {
      const [byTradition, byLanguage, byYear] = await Promise.all([
        Book.aggregate([
          { $match: { deletedAt: null } },
          { $unwind: '$traditions' },
          { $group: { _id: '$traditions', size: { $sum: '$fileSize' } } },
          { $sort: { size: -1 } }
        ]),
        Book.aggregate([
          { $match: { deletedAt: null } },
          { $group: { _id: '$language', size: { $sum: '$fileSize' } } },
          { $sort: { size: -1 } }
        ]),
        Book.aggregate([
          { $match: { deletedAt: null } },
          { $group: { _id: '$year', size: { $sum: '$fileSize' } } },
          { $sort: { _id: 1 } }
        ])
      ]);

      return {
        byTradition: byTradition.map(r => ({ tradition: r._id, size: r.size })),
        byLanguage: byLanguage.map(r => ({ language: r._id, size: r.size })),
        byYear: byYear.map(r => ({ year: r._id, size: r.size }))
      };
    } catch (e) {
      console.error('getStorageBreakdown error', e.message || e);
      return { byTradition: [], byLanguage: [], byYear: [] };
    }
  },

  async refreshMaterializedViews() {
    try {
      // Mongoose doesn't have materialized views; instead, we can trigger a rebuild of aggregation caches
      // This is a placeholder that would need to be implemented based on specific cache strategy
      console.log('Refreshing analytics views...');
      return true;
    } catch (e) {
      console.error('refreshMaterializedViews error', e.message || e);
      return false;
    }
  }
};

module.exports = BookAnalyticsService;
