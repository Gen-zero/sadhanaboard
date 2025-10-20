-- Create a table for user-uploaded spiritual books
CREATE TABLE public.spiritual_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  traditions TEXT[] NOT NULL DEFAULT '{}',
  content TEXT, -- This will be optional now
  storage_url TEXT, -- New field for file storage URL
  is_storage_file BOOLEAN DEFAULT false, -- New field to indicate if it's a stored file
  description TEXT,
  year INTEGER,
  language TEXT DEFAULT 'english',
  page_count INTEGER,
  cover_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add the new columns to existing table if they don't exist
ALTER TABLE public.spiritual_books 
ADD COLUMN IF NOT EXISTS storage_url TEXT,
ADD COLUMN IF NOT EXISTS is_storage_file BOOLEAN DEFAULT false;

-- Add settings column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS settings JSONB;

-- Add new profile columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gotra TEXT,
ADD COLUMN IF NOT EXISTS varna TEXT,
ADD COLUMN IF NOT EXISTS sampradaya TEXT;

-- Create a storage bucket for book covers and files
INSERT INTO storage.buckets (id, name, public)
VALUES ('spiritual-books', 'spiritual-books', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) on the spiritual_books table
ALTER TABLE public.spiritual_books ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view all books (public reading)
CREATE POLICY "Anyone can view spiritual books" 
  ON public.spiritual_books 
  FOR SELECT 
  USING (true);

-- Create policy that allows authenticated users to upload books
CREATE POLICY "Authenticated users can create spiritual books" 
  ON public.spiritual_books 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to update their own books
CREATE POLICY "Users can update their own spiritual books" 
  ON public.spiritual_books 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to delete their own books
CREATE POLICY "Users can delete their own spiritual books" 
  ON public.spiritual_books 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage policies for the spiritual-books bucket
CREATE POLICY "Anyone can view spiritual book files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'spiritual-books');

CREATE POLICY "Authenticated users can upload spiritual book files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'spiritual-books' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own spiritual book files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'spiritual-books' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own spiritual book files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'spiritual-books' AND auth.uid()::text = (storage.foldername(name))[1]);