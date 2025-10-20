-- Create reading progress, bookmarks, and annotations tables
BEGIN;

-- book_progress: one row per user+book
CREATE TABLE IF NOT EXISTS book_progress (
  id serial PRIMARY KEY,
  user_id integer NOT NULL,
  book_id integer NOT NULL,
  position text,
  page integer,
  percent numeric(5,2),
  last_seen_at timestamptz DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES spiritual_books(id) ON DELETE CASCADE,
  UNIQUE(user_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_book_progress_user_book ON book_progress (user_id, book_id);

-- bookmarks
CREATE TABLE IF NOT EXISTS book_bookmarks (
  id serial PRIMARY KEY,
  user_id integer NOT NULL,
  book_id integer NOT NULL,
  label text,
  page integer,
  position jsonb,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_bm_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_bm_book FOREIGN KEY (book_id) REFERENCES spiritual_books(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_book ON book_bookmarks (user_id, book_id);

-- annotations
CREATE TABLE IF NOT EXISTS book_annotations (
  id serial PRIMARY KEY,
  user_id integer NOT NULL,
  book_id integer NOT NULL,
  page integer,
  position jsonb,
  content text,
  is_private boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_ann_user FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_ann_book FOREIGN KEY (book_id) REFERENCES spiritual_books(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_annotations_user_book ON book_annotations (user_id, book_id);
CREATE INDEX IF NOT EXISTS idx_annotations_content_gin ON book_annotations USING gin (to_tsvector('english', coalesce(content, '')));

-- add file metadata columns to spiritual_books if missing
ALTER TABLE spiritual_books
  ADD COLUMN IF NOT EXISTS file_size bigint,
  ADD COLUMN IF NOT EXISTS storage_provider text,
  ADD COLUMN IF NOT EXISTS storage_path text,
  ADD COLUMN IF NOT EXISTS storage_url text,
  ADD COLUMN IF NOT EXISTS optimized boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS optimized_path text,
  ADD COLUMN IF NOT EXISTS thumbnail_path text;

COMMIT;
