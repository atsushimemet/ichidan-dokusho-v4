-- Cleanup books table - Remove unnecessary columns
-- Date: 2025-01-06
-- Description: Remove old columns that are no longer needed for the new book registration system

-- First, check current table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'books' 
ORDER BY ordinal_position;

-- Remove unnecessary columns
-- WARNING: This will permanently delete data in these columns
-- Make sure to backup any important data before running these commands

-- Remove old columns that are no longer used
ALTER TABLE books DROP COLUMN IF EXISTS isbn;
ALTER TABLE books DROP COLUMN IF EXISTS category;
-- ALTER TABLE books DROP COLUMN IF EXISTS tags; -- タグは必要なので削除しない
ALTER TABLE books DROP COLUMN IF EXISTS recommended_by;

-- Remove related indexes for deleted columns
DROP INDEX IF EXISTS idx_books_isbn;
DROP INDEX IF EXISTS idx_books_category;
-- DROP INDEX IF EXISTS idx_books_tags; -- タグのインデックスは保持
DROP INDEX IF EXISTS idx_books_recommended_by;

-- Verify the final table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'books' 
ORDER BY ordinal_position;

-- Expected final columns:
-- id (UUID, PRIMARY KEY)
-- title (TEXT, NOT NULL)
-- author (TEXT, NOT NULL)
-- description (TEXT)
-- amazon_paper_url (TEXT)
-- amazon_ebook_url (TEXT)
-- amazon_audiobook_url (TEXT)
-- summary_text_url (TEXT)
-- summary_video_url (TEXT)
-- recommended_by_post_url (TEXT)
-- tags (TEXT[]) -- タグは保持
-- cover_image_url (TEXT)
-- created_at (TIMESTAMP WITH TIME ZONE)
-- updated_at (TIMESTAMP WITH TIME ZONE)
