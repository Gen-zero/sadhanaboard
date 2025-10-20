-- Add soft delete support for spiritual_books
ALTER TABLE public.spiritual_books
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_spiritual_books_deleted_at ON public.spiritual_books(deleted_at);

-- Update RLS policies to ensure public users only see non-deleted books
DROP POLICY IF EXISTS "Anyone can view spiritual books" ON public.spiritual_books;
CREATE POLICY "Anyone can view active spiritual books"
  ON public.spiritual_books
  FOR SELECT
  USING (deleted_at IS NULL);

-- Comment for documentation
COMMENT ON COLUMN public.spiritual_books.deleted_at IS 'Timestamp when book was soft deleted. NULL means active.';
