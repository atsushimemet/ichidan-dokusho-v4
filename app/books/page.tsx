'use client'

import Navigation from '@/components/Navigation'
import { BookOpen, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Twitter } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

// Amazon画像URL生成関数
function generateAmazonImageUrl(asin: string, size: 'large' | 'medium' | 'small' = 'small'): string {
  const sizeMap = {
    large: 'SL500',
    medium: 'SL160',
    small: 'SL110'
  }
  return `http://images.amazon.com/images/P/${asin}.09_${sizeMap[size]}_.jpg`
}

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
  asin?: string | null
}

const ITEMS_PER_PAGE = 50

export default function BooksPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAllTags, setShowAllTags] = useState(false)

  // 書籍データをAPIから取得
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true)
        // 全件取得するために大きなlimitを指定
        const response = await fetch('/api/books?limit=1000')
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

  // 全タグを取得（ユニークにして並び替え）
  const allTags = useMemo(() => {
    return Array.from(new Set(books.flatMap(book => book.tags || []))).sort()
  }, [books])

  // 最初の10個のタグ（デフォルト表示用）
  const defaultTags = useMemo(() => {
    return allTags.slice(0, 10)
  }, [allTags])

  // 表示するタグリスト
  const displayedTags = showAllTags ? allTags : defaultTags

  // フィルタリングされた書籍（選択されたすべてのタグを含む書籍を表示）
  const filteredBooks = useMemo(() => {
    if (selectedTags.length === 0) {
      return books
    }
    return books.filter(book => {
      if (!book.tags || book.tags.length === 0) return false
      // 選択されたすべてのタグを含むかチェック
      return selectedTags.every(selectedTag => book.tags!.includes(selectedTag))
    })
  }, [books, selectedTags])

  // ページネーション計算
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentBooks = filteredBooks.slice(startIndex, endIndex)

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        // 既に選択されている場合は削除
        return prev.filter(t => t !== tag)
      } else {
        // 選択されていない場合は追加
        return [...prev, tag]
      }
    })
    setCurrentPage(1) // フィルタ変更時に最初のページに戻る
  }

  const handleClearTags = () => {
    setSelectedTags([])
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">タグでフィルタ（複数選択可）</h2>
              {selectedTags.length > 0 && (
                <button
                  onClick={handleClearTags}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  すべてクリア
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {displayedTags.map((tag) => {
                const isSelected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-primary-600 text-white shadow-md ring-2 ring-primary-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {tag}
                  </button>
                )
              })}
            </div>

            {/* もっとタグを見るアコーディオン */}
            {allTags.length > 10 && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors text-sm font-medium"
              >
                {showAllTags ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span>タグを閉じる</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>もっとタグを見る ({allTags.length - 10}個)</span>
                  </>
                )}
              </button>
            )}

            {selectedTags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-600 font-medium">選択中:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full flex items-center space-x-1"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => handleTagToggle(tag)}
                          className="ml-1 hover:text-primary-900 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {filteredBooks.length}件の書籍が見つかりました
                </div>
              </div>
            )}
          </div>

          {/* Books Grid */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                {filteredBooks.length}件中 {startIndex + 1}〜{Math.min(endIndex, filteredBooks.length)}件を表示
              </p>
              <p className="text-sm text-gray-600">
                ページ {currentPage} / {totalPages}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentBooks.map((book) => (
                <div key={book.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="flex flex-col h-full">
                    {/* 書籍画像 */}
                    <div className="flex justify-center mb-4">
                      {book.asin ? (
                        <div className="w-24 h-32 relative">
                          <img
                            src={generateAmazonImageUrl(book.asin)}
                            alt={book.title}
                            className="w-full h-full object-cover rounded-lg shadow-md"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              const fallback = target.nextElementSibling as HTMLElement
                              if (fallback) fallback.style.display = 'flex'
                            }}
                          />
                          <div className="w-24 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center hidden absolute top-0">
                            <BookOpen className="w-12 h-12 text-primary-600" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-primary-600" />
                        </div>
                      )}
                    </div>

                    {/* 書籍情報 */}
                    <div className="flex-1 flex flex-col">
                      <Link 
                        href={`/books/${book.id}`} 
                        className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors"
                      >
                        {book.title}
                      </Link>
                      <p className="text-sm text-gray-600 mb-3">
                        {book.author}
                      </p>
                      {book.description && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-3">
                          {book.description}
                        </p>
                      )}
                      
                      {/* Tags */}
                      {book.tags && book.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {book.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {book.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              +{book.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* 推薦ポストリンク */}
                      {book.recommended_by_post_url && (
                        <a
                          href={book.recommended_by_post_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors text-sm mt-auto"
                        >
                          <Twitter className="w-4 h-4" />
                          <span>推薦ポスト</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* ページ番号 */}
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // 最初と最後、現在のページ前後2つを表示
                    return (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    )
                  })
                  .map((page, index, array) => {
                    // 省略記号を挿入
                    const prevPage = array[index - 1]
                    const showEllipsis = prevPage && page - prevPage > 1

                    return (
                      <div key={page} className="flex items-center space-x-2">
                        {showEllipsis && (
                          <span className="text-gray-400 px-2">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    )
                  })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
