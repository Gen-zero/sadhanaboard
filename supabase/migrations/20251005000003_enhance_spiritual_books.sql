-- Enhance spiritual_books table with additional metadata
BEGIN;

-- Add deity association for books related to specific deities
ALTER TABLE spiritual_books ADD COLUMN IF NOT EXISTS deity_association TEXT[];

-- Add tradition field for books associated with specific traditions
ALTER TABLE spiritual_books ADD COLUMN IF NOT EXISTS tradition TEXT;

-- Add difficulty level field
ALTER TABLE spiritual_books ADD COLUMN IF NOT EXISTS difficulty_level TEXT DEFAULT 'intermediate';

-- Add reading progress tracking fields
ALTER TABLE spiritual_books ADD COLUMN IF NOT EXISTS avg_rating NUMERIC(3,2);
ALTER TABLE spiritual_books ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0;

-- Add categories for better organization
ALTER TABLE spiritual_books ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';

-- Add publication info
ALTER TABLE spiritual_books ADD COLUMN IF NOT EXISTS publisher TEXT;
ALTER TABLE spiritual_books ADD COLUMN IF NOT EXISTS isbn TEXT;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_spiritual_books_deity ON spiritual_books USING GIN(deity_association);
CREATE INDEX IF NOT EXISTS idx_spiritual_books_tradition ON spiritual_books(tradition);
CREATE INDEX IF NOT EXISTS idx_spiritual_books_difficulty ON spiritual_books(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_spiritual_books_categories ON spiritual_books USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_spiritual_books_rating ON spiritual_books(avg_rating DESC);

-- Add default values for existing books
UPDATE spiritual_books 
SET 
  difficulty_level = 'intermediate'
WHERE difficulty_level IS NULL;

COMMIT;