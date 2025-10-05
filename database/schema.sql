-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (using Supabase Auth)
-- This table is automatically created by Supabase Auth, but we can add custom fields
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  isbn TEXT,
  cover_image_url TEXT,
  category TEXT,
  tags TEXT[],
  recommended_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookstores table
CREATE TABLE IF NOT EXISTS bookstores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  website TEXT,
  phone TEXT,
  tags TEXT[],
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create memos table
CREATE TABLE IF NOT EXISTS memos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  page_number INTEGER,
  chapter TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  memo_id UUID REFERENCES memos(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  current_page INTEGER,
  total_pages INTEGER,
  status TEXT CHECK (status IN ('reading', 'completed', 'paused')) DEFAULT 'reading',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken INTEGER NOT NULL, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at);
CREATE INDEX IF NOT EXISTS idx_memos_book_id ON memos(book_id);
CREATE INDEX IF NOT EXISTS idx_memos_user_id ON memos(user_id);
CREATE INDEX IF NOT EXISTS idx_memos_created_at ON memos(created_at);
CREATE INDEX IF NOT EXISTS idx_quizzes_book_id ON quizzes(book_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_difficulty ON quizzes(difficulty);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookstores_updated_at BEFORE UPDATE ON bookstores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_memos_updated_at BEFORE UPDATE ON memos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookstores ENABLE ROW LEVEL SECURITY;
ALTER TABLE memos ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Books: Public read access
CREATE POLICY "Books are viewable by everyone" ON books FOR SELECT USING (true);
CREATE POLICY "Books are insertable by authenticated users" ON books FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Books are updatable by authenticated users" ON books FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Books are deletable by authenticated users" ON books FOR DELETE USING (auth.role() = 'authenticated');

-- Bookstores: Public read access
CREATE POLICY "Bookstores are viewable by everyone" ON bookstores FOR SELECT USING (true);
CREATE POLICY "Bookstores are insertable by authenticated users" ON bookstores FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Bookstores are updatable by authenticated users" ON bookstores FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Bookstores are deletable by authenticated users" ON bookstores FOR DELETE USING (auth.role() = 'authenticated');

-- Memos: Users can only see their own memos
CREATE POLICY "Memos are viewable by owner" ON memos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Memos are insertable by authenticated users" ON memos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Memos are updatable by owner" ON memos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Memos are deletable by owner" ON memos FOR DELETE USING (auth.uid() = user_id);

-- Quizzes: Public read access
CREATE POLICY "Quizzes are viewable by everyone" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Quizzes are insertable by authenticated users" ON quizzes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Quizzes are updatable by authenticated users" ON quizzes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Quizzes are deletable by authenticated users" ON quizzes FOR DELETE USING (auth.role() = 'authenticated');

-- User Progress: Users can only see their own progress
CREATE POLICY "User progress is viewable by owner" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User progress is insertable by authenticated users" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User progress is updatable by owner" ON user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "User progress is deletable by owner" ON user_progress FOR DELETE USING (auth.uid() = user_id);

-- Quiz Attempts: Users can only see their own attempts
CREATE POLICY "Quiz attempts are viewable by owner" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Quiz attempts are insertable by authenticated users" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Quiz attempts are updatable by owner" ON quiz_attempts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Quiz attempts are deletable by owner" ON quiz_attempts FOR DELETE USING (auth.uid() = user_id);

-- User Profiles: Users can only see and modify their own profile
CREATE POLICY "User profiles are viewable by owner" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "User profiles are insertable by authenticated users" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "User profiles are updatable by owner" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "User profiles are deletable by owner" ON user_profiles FOR DELETE USING (auth.uid() = id);
