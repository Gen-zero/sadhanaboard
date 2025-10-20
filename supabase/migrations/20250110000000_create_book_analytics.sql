-- Migration: Add file_size to spiritual_books and create book_analytics tables

-- 1. Add file_size column
ALTER TABLE IF EXISTS spiritual_books ADD COLUMN IF NOT EXISTS file_size BIGINT DEFAULT NULL;
COMMENT ON COLUMN spiritual_books.file_size IS 'File size in bytes for PDF files';

-- 2. Create book_analytics table
CREATE TABLE IF NOT EXISTS book_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES spiritual_books(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('view','download')),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE book_analytics IS 'Tracks book view and download events for analytics';
COMMENT ON COLUMN book_analytics.event_type IS 'Type of event: view (book opened) or download (file served)';

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_book_analytics_book_id ON book_analytics(book_id);
CREATE INDEX IF NOT EXISTS idx_book_analytics_event_type ON book_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_book_analytics_created_at ON book_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_book_analytics_book_event ON book_analytics(book_id, event_type, created_at DESC);

-- 4. Materialized view for daily aggregates
CREATE MATERIALIZED VIEW IF NOT EXISTS book_analytics_daily AS
SELECT
  book_id,
  event_type,
  DATE(created_at) as date,
  COUNT(*) as count
FROM book_analytics
GROUP BY book_id, event_type, DATE(created_at);

CREATE INDEX IF NOT EXISTS idx_book_analytics_daily_date ON book_analytics_daily(date DESC);

-- Refresh helper
CREATE OR REPLACE FUNCTION refresh_book_analytics_daily()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY book_analytics_daily;
END;
$$ LANGUAGE plpgsql;

-- 5. Helper views
CREATE OR REPLACE VIEW popular_books_30d AS
SELECT 
  b.id,
  b.title,
  b.author,
  COUNT(a.id) as view_count
FROM spiritual_books b
LEFT JOIN book_analytics a ON b.id = a.book_id 
  AND a.event_type = 'view' 
  AND a.created_at > NOW() - INTERVAL '30 days'
WHERE b.deleted_at IS NULL
GROUP BY b.id, b.title, b.author
ORDER BY view_count DESC
LIMIT 50;

CREATE OR REPLACE VIEW book_download_stats AS
SELECT 
  book_id,
  COUNT(*) as total_downloads,
  COUNT(DISTINCT user_id) as unique_users,
  MAX(created_at) as last_download
FROM book_analytics
WHERE event_type = 'download'
GROUP BY book_id;

-- 6. RLS policies (optional) - Not enabling by default; use service role for inserts
-- CREATE POLICY "Admins can view analytics" ON book_analytics FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
-- CREATE POLICY "Only system can insert analytics" ON book_analytics FOR INSERT WITH CHECK (false);
