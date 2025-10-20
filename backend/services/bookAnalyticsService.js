const db = require('../config/db');

const BookAnalyticsService = {
  async trackBookEvent(bookId, eventType, userId = null, metadata = {}) {
    try {
      const { ip_address = null, user_agent = null } = metadata || {};
      await db.query(
        `INSERT INTO book_analytics (book_id, event_type, user_id, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)`,
        [bookId, eventType, userId, ip_address, user_agent]
      );
    } catch (e) {
      // Do not throw - tracking must be non-blocking
      console.error('Failed to track book event', e.message || e);
    }
  },

  async getLibraryOverview() {
    try {
      const totalBooksRes = await db.query(`SELECT COUNT(*)::int as total FROM spiritual_books WHERE deleted_at IS NULL`);
      const storageRes = await db.query(`SELECT COALESCE(SUM(file_size),0)::bigint as total_storage FROM spiritual_books WHERE deleted_at IS NULL AND file_size IS NOT NULL`);
      const recentUploadsRes = await db.query(`SELECT COUNT(*)::int as recent FROM spiritual_books WHERE created_at > NOW() - INTERVAL '7 days' AND deleted_at IS NULL`);
      const totalViewsRes = await db.query(`SELECT COUNT(*)::int as total FROM book_analytics WHERE event_type = 'view'`);
      const totalDownloadsRes = await db.query(`SELECT COUNT(*)::int as total FROM book_analytics WHERE event_type = 'download'`);

      return {
        totalBooks: Number(totalBooksRes.rows[0].total || 0),
        totalStorage: Number(storageRes.rows[0].total_storage || 0),
        recentUploads: Number(recentUploadsRes.rows[0].recent || 0),
        totalViews: Number(totalViewsRes.rows[0].total || 0),
        totalDownloads: Number(totalDownloadsRes.rows[0].total || 0)
      };
    } catch (e) {
      console.error('getLibraryOverview error', e.message || e);
      return { totalBooks: 0, totalStorage: 0, recentUploads: 0, totalViews: 0, totalDownloads: 0 };
    }
  },

  async getUploadTrends(days = 30) {
    try {
      const res = await db.query(
        `SELECT DATE(created_at) as date, COUNT(*)::int as count FROM spiritual_books WHERE created_at > NOW() - INTERVAL '${Number(days)} days' AND deleted_at IS NULL GROUP BY DATE(created_at) ORDER BY date`
      );
      return res.rows.map(r => ({ date: r.date, count: Number(r.count) }));
    } catch (e) {
      console.error('getUploadTrends error', e.message || e);
      return [];
    }
  },

  async getPopularBooks(limit = 10, days = 30) {
    try {
      const res = await db.query(
        `SELECT b.id, b.title, b.author, COALESCE(COUNT(a.id),0)::int as views FROM spiritual_books b LEFT JOIN book_analytics a ON b.id = a.book_id AND a.event_type = 'view' AND a.created_at > NOW() - INTERVAL '${Number(days)} days' WHERE b.deleted_at IS NULL GROUP BY b.id, b.title, b.author ORDER BY views DESC LIMIT $1`,
        [Number(limit)]
      );
      return res.rows.map(r => ({ id: r.id, title: r.title, author: r.author, views: Number(r.views) }));
    } catch (e) {
      console.error('getPopularBooks error', e.message || e);
      return [];
    }
  },

  async getTopDownloads(limit = 10, days = 30) {
    try {
      const res = await db.query(
        `SELECT b.id, b.title, b.author, COALESCE(COUNT(a.id),0)::int as downloads FROM spiritual_books b LEFT JOIN book_analytics a ON b.id = a.book_id AND a.event_type = 'download' AND a.created_at > NOW() - INTERVAL '${Number(days)} days' WHERE b.deleted_at IS NULL GROUP BY b.id, b.title, b.author ORDER BY downloads DESC LIMIT $1`,
        [Number(limit)]
      );
      return res.rows.map(r => ({ id: r.id, title: r.title, author: r.author, downloads: Number(r.downloads) }));
    } catch (e) {
      console.error('getTopDownloads error', e.message || e);
      return [];
    }
  },

  async getEngagementMetrics(days = 30) {
    try {
      const viewsRes = await db.query(`SELECT DATE(created_at) as date, COUNT(*)::int as count FROM book_analytics WHERE event_type = 'view' AND created_at > NOW() - INTERVAL '${Number(days)} days' GROUP BY DATE(created_at) ORDER BY date`);
      const dlRes = await db.query(`SELECT DATE(created_at) as date, COUNT(*)::int as count FROM book_analytics WHERE event_type = 'download' AND created_at > NOW() - INTERVAL '${Number(days)} days' GROUP BY DATE(created_at) ORDER BY date`);
      const uniqueViewersRes = await db.query(`SELECT COUNT(DISTINCT user_id)::int as unique_viewers FROM book_analytics WHERE event_type = 'view' AND created_at > NOW() - INTERVAL '${Number(days)} days' AND user_id IS NOT NULL`);
      const totalViewsRes = await db.query(`SELECT COUNT(*)::int as total FROM book_analytics WHERE event_type = 'view' AND created_at > NOW() - INTERVAL '${Number(days)} days'`);
      const totalBooksRes = await db.query(`SELECT COUNT(*)::int as total FROM spiritual_books WHERE deleted_at IS NULL`);

      const viewsOverTime = viewsRes.rows.map(r => ({ date: r.date, count: Number(r.count) }));
      const downloadsOverTime = dlRes.rows.map(r => ({ date: r.date, count: Number(r.count) }));
      const uniqueViewers = Number(uniqueViewersRes.rows[0].unique_viewers || 0);
      const avgViewsPerBook = totalBooksRes.rows[0] && totalBooksRes.rows[0].total ? (Number(totalViewsRes.rows[0].total || 0) / Number(totalBooksRes.rows[0].total)) : 0;

      return { viewsOverTime, downloadsOverTime, uniqueViewers, avgViewsPerBook };
    } catch (e) {
      console.error('getEngagementMetrics error', e.message || e);
      return { viewsOverTime: [], downloadsOverTime: [], uniqueViewers: 0, avgViewsPerBook: 0 };
    }
  },

  async getBookAnalytics(bookId) {
    try {
      const totalViewsRes = await db.query(`SELECT COUNT(*)::int as total FROM book_analytics WHERE book_id = $1 AND event_type = 'view'`, [bookId]);
      const totalDownloadsRes = await db.query(`SELECT COUNT(*)::int as total FROM book_analytics WHERE book_id = $1 AND event_type = 'download'`, [bookId]);
      const uniqueViewersRes = await db.query(`SELECT COUNT(DISTINCT user_id)::int as total FROM book_analytics WHERE book_id = $1 AND event_type = 'view' AND user_id IS NOT NULL`, [bookId]);
      const firstViewedRes = await db.query(`SELECT MIN(created_at) as first_view FROM book_analytics WHERE book_id = $1 AND event_type = 'view'`, [bookId]);
      const lastViewedRes = await db.query(`SELECT MAX(created_at) as last_view FROM book_analytics WHERE book_id = $1 AND event_type = 'view'`, [bookId]);
      const trendRes = await db.query(`SELECT DATE(created_at) as date, COUNT(*)::int as count FROM book_analytics WHERE book_id = $1 AND event_type = 'view' AND created_at > NOW() - INTERVAL '30 days' GROUP BY DATE(created_at) ORDER BY date`, [bookId]);

      return {
        totalViews: Number(totalViewsRes.rows[0].total || 0),
        totalDownloads: Number(totalDownloadsRes.rows[0].total || 0),
        uniqueViewers: Number(uniqueViewersRes.rows[0].total || 0),
        firstViewed: firstViewedRes.rows[0] ? firstViewedRes.rows[0].first_view : null,
        lastViewed: lastViewedRes.rows[0] ? lastViewedRes.rows[0].last_view : null,
        viewTrend: trendRes.rows.map(r => ({ date: r.date, count: Number(r.count) }))
      };
    } catch (e) {
      console.error('getBookAnalytics error', e.message || e);
      return { totalViews: 0, totalDownloads: 0, uniqueViewers: 0, firstViewed: null, lastViewed: null, viewTrend: [] };
    }
  },

  async generateAnalyticsReport(filters = {}) {
    try {
      const { startDate, endDate, bookIds, eventType } = filters || {};
      const where = [];
      const params = [];
      if (startDate) { params.push(startDate); where.push(`created_at >= $${params.length}`); }
      if (endDate) { params.push(endDate); where.push(`created_at <= $${params.length}`); }
      if (Array.isArray(bookIds) && bookIds.length > 0) { params.push(bookIds); where.push(`book_id = ANY($${params.length})`); }
      if (eventType) { params.push(eventType); where.push(`event_type = $${params.length}`); }

      const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';
      const q = `SELECT a.*, b.title as book_title, b.author as book_author FROM book_analytics a LEFT JOIN spiritual_books b ON a.book_id = b.id ${whereSQL} ORDER BY a.created_at DESC`;
      const res = await db.query(q, params);
      return res.rows.map(r => ({ book_title: r.book_title, book_author: r.book_author, event_type: r.event_type, event_date: r.created_at, user_id: r.user_id }));
    } catch (e) {
      console.error('generateAnalyticsReport error', e.message || e);
      return [];
    }
  },

  async getStorageBreakdown() {
    try {
      const byTradRes = await db.query(`SELECT unnest(traditions) as tradition, COALESCE(SUM(file_size),0)::bigint as size FROM spiritual_books WHERE deleted_at IS NULL GROUP BY tradition ORDER BY size DESC`);
      const byLangRes = await db.query(`SELECT language, COALESCE(SUM(file_size),0)::bigint as size FROM spiritual_books WHERE deleted_at IS NULL GROUP BY language ORDER BY size DESC`);
      const byYearRes = await db.query(`SELECT year, COALESCE(SUM(file_size),0)::bigint as size FROM spiritual_books WHERE deleted_at IS NULL GROUP BY year ORDER BY year`);

      return {
        byTradition: byTradRes.rows.map(r => ({ tradition: r.tradition, size: Number(r.size) })),
        byLanguage: byLangRes.rows.map(r => ({ language: r.language, size: Number(r.size) })),
        byYear: byYearRes.rows.map(r => ({ year: r.year, size: Number(r.size) }))
      };
    } catch (e) {
      console.error('getStorageBreakdown error', e.message || e);
      return { byTradition: [], byLanguage: [], byYear: [] };
    }
  },

  async refreshMaterializedViews() {
    try {
      await db.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY book_analytics_daily`);
      return true;
    } catch (e) {
      console.error('refreshMaterializedViews error', e.message || e);
      return false;
    }
  }
};

module.exports = BookAnalyticsService;
