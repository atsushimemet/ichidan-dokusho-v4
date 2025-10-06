'use client'

import { BookOpen, ChevronLeft, ChevronRight, Twitter } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'

interface Book {
  id: string
  title: string
  author: string
  description?: string
  tags?: string[]
  recommended_by_post_url?: string
  amazon_paper_url?: string
  amazon_ebook_url?: string
  amazon_audiobook_url?: string
  summary_text_url?: string
  summary_video_url?: string
  cover_image_url?: string
  created_at: string
}

export default function BooksPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 書籍データをAPIから取得
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/books')
        if (!response.ok) {
          throw new Error('Failed to fetch books')
        }
        const data = await response.json()
        setBooks(data.books || [])
      } catch (err) {
        console.error('Error fetching books:', err)
        setError('書籍データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  // 全タグを取得
  const allTags = Array.from(new Set(books.flatMap(book => book.tags || [])))

  // フィルタリングされた書籍
  const filteredBooks = selectedTag 
    ? books.filter(book => book.tags?.includes(selectedTag))
    : books

  const totalSlides = filteredBooks.length

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag)
    setCurrentSlide(0) // フィルタ変更時に最初のスライドに戻る
  }

  // ローディング状態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">読み込み中...</h2>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // エラー状態
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">エラーが発生しました</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              書籍一覧
            </h1>
            <p className="text-lg text-gray-600">
              おすすめの書籍をチェックして、あなたの読書ライフを豊かにしましょう
            </p>
          </div>

          {/* Tag Filter */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">タグでフィルタ</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTagSelect(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === null
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                すべて
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTag && (
              <div className="mt-4 text-sm text-gray-600">
                「{selectedTag}」でフィルタ中 ({filteredBooks.length}件)
              </div>
            )}
          </div>

          {/* Books Slider */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {filteredBooks.map((book) => (
                    <div key={book.id} className="w-full flex-shrink-0">
                      <div className="flex justify-center">
                        <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow max-w-sm w-full">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mb-6">
                              <BookOpen className="w-10 h-10 text-primary-600" />
                            </div>
                            <Link href={`/books/${book.id}`} className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-primary-600 transition-colors">
                              {book.title}
                            </Link>
                            <p className="text-base text-gray-600 mb-2">
                              著者: {book.author}
                            </p>
                            {book.description && (
                              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                {book.description}
                              </p>
                            )}
                            
                            {/* Tags */}
                            {book.tags && book.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 justify-center mb-6">
                                {book.tags.map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {book.recommended_by_post_url && (
                              <a
                                href={book.recommended_by_post_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
                              >
                                <Twitter className="w-5 h-5" />
                                <span className="font-medium">推薦ポストを見る</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
