export interface Book {
  id: string
  title: string
  author: string
  description?: string
  tags?: string[]
  asin?: string | null
  created_at: string
  updated_at: string
  amazon_paper_url?: string
  amazon_ebook_url?: string
  amazon_audiobook_url?: string
  summary_text_url?: string
  summary_video_url?: string
  recommended_by_post_url?: string
}

export interface Memo {
  id: string
  book_id: string
  user_id: string
  content: string
  page_number?: number
  chapter?: string
  tags?: string[]
  created_at: string
  updated_at: string
  books?: {
    id: string
    title: string
    author: string
  }
}

export interface Quiz {
  id: string
  book_id: string
  memo_id?: string
  question: string
  options: string[]
  correct_answer: number
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
  created_at: string
  updated_at: string
}

export interface Bookstore {
  id: string
  name: string
  address: string
  description: string
  website?: string
  phone?: string
  tags: string[]
  latitude?: number
  longitude?: number
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  book_id: string
  current_page?: number
  total_pages?: number
  status: 'reading' | 'completed' | 'paused'
  started_at: string
  completed_at?: string
  updated_at: string
}

export interface QuizAttempt {
  id: string
  user_id: string
  quiz_id: string
  selected_answer: number
  is_correct: boolean
  time_taken: number // in seconds
  created_at: string
}
