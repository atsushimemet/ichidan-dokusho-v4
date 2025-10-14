-- Add is_public column to memos table
ALTER TABLE memos ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Drop existing RLS policies for memos
DROP POLICY IF EXISTS "Memos are viewable by owner" ON memos;
DROP POLICY IF EXISTS "Memos are insertable by authenticated users" ON memos;
DROP POLICY IF EXISTS "Memos are updatable by owner" ON memos;
DROP POLICY IF EXISTS "Memos are deletable by owner" ON memos;

-- Create new RLS policies for memos
-- Public memos are viewable by everyone, private memos only by owner
CREATE POLICY "Public memos are viewable by everyone" ON memos 
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- Only authenticated users can insert memos (as themselves)
CREATE POLICY "Memos are insertable by authenticated users" ON memos 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only owners can update their memos
CREATE POLICY "Memos are updatable by owner" ON memos 
  FOR UPDATE USING (auth.uid() = user_id);

-- Only owners can delete their memos
CREATE POLICY "Memos are deletable by owner" ON memos 
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance on is_public queries
CREATE INDEX IF NOT EXISTS idx_memos_is_public ON memos(is_public);
