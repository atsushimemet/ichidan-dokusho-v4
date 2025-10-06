-- Migration: Update books table schema for new book registration system
-- Date: 2025-01-06

-- Add new columns to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS amazon_paper_url TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS amazon_ebook_url TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS amazon_audiobook_url TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS summary_text_url TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS summary_video_url TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS recommended_by_post_url TEXT;
-- tags column should already exist, but add it if it doesn't
ALTER TABLE books ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Remove old columns (optional - comment out if you want to keep existing data)
-- ALTER TABLE books DROP COLUMN IF EXISTS isbn;
-- ALTER TABLE books DROP COLUMN IF EXISTS category;
-- tags column is kept - do not drop
-- ALTER TABLE books DROP COLUMN IF EXISTS recommended_by;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_amazon_paper_url ON books(amazon_paper_url);
CREATE INDEX IF NOT EXISTS idx_books_amazon_ebook_url ON books(amazon_ebook_url);
CREATE INDEX IF NOT EXISTS idx_books_amazon_audiobook_url ON books(amazon_audiobook_url);
CREATE INDEX IF NOT EXISTS idx_books_summary_text_url ON books(summary_text_url);
CREATE INDEX IF NOT EXISTS idx_books_summary_video_url ON books(summary_video_url);
CREATE INDEX IF NOT EXISTS idx_books_recommended_by_post_url ON books(recommended_by_post_url);
-- tags index should already exist, but create it if it doesn't
CREATE INDEX IF NOT EXISTS idx_books_tags ON books USING GIN(tags);
