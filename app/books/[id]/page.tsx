'use client'

import Navigation from '@/components/Navigation'
import { useAuth } from '@/hooks/useAuth'
import { BookOpen, Calendar, ChevronRight, Edit2, ExternalLink, Globe, Lock, Plus, Trash2, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Amazon画像URL生成関数
function generateAmazonImageUrl(asin: string, size: 'large' | 'medium' | 'small' = 'small'): string {
  const sizeMap = {
    large: 'SL500',
    medium: 'SL160',
    small: 'SL110'
  }
  return `http://images.amazon.com/images/P/${asin}.09_${sizeMap[size]}_.jpg`
}

// ASIN抽出関数（クライアント側用）
function extractASINFromUrl(url: string): string | null {
  if (!url) return null
  
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/product\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }
  
  return null
}

// 非アフィリエイトリンクを生成する関数
function generateNonAffiliateLink(url: string | undefined | null, asin: string | null): string | null {
  if (!url) return null
  
  // ASINが取得できている場合は、それを使って非アフィリエイトリンクを生成
  if (asin) {
    return `https://www.amazon.co.jp/dp/${asin}`
  }
  
  // ASINが取得できていない場合は、URLから抽出を試みる
  const extractedAsin = extractASINFromUrl(url)
  if (extractedAsin) {
    return `https://www.amazon.co.jp/dp/${extractedAsin}`
  }
  
  // ASINが抽出できない場合は元のURLをそのまま返す
  return url
}

function resolveBookLink(
  url: string | undefined | null,
  asin: string | undefined | null,
  isAffiliateMode: boolean
): string {
  if (!url) {
    return ''
  }
  if (isAffiliateMode) {
    return url
  }
  return generateNonAffiliateLink(url, asin ?? null) ?? url
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

interface Memo {
  id: string
  book_id: string
  user_id: string
  content: string
  is_public: boolean
  created_at: string
  user_profiles?: {
    id: string
    name: string | null
  }
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [book, setBook] = useState<Book | null>(null)
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([])
  const [memos, setMemos] = useState<Memo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAffiliateMode, setIsAffiliateMode] = useState(true)
  const [deletingMemoId, setDeletingMemoId] = useState<string | null>(null)

  // 書籍詳細データをAPIから取得
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/books/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch book')
        }
        const data = await response.json()
        setBook(data.book)
      } catch (err) {
        console.error('Error fetching book:', err)
        setError('書籍データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [params.id])

  // 関連書籍（同じタグを持つ書籍）を取得
  useEffect(() => {
    const fetchRelatedBooks = async () => {
      if (!book || !book.tags || book.tags.length === 0) {
        setRelatedBooks([])
        return
      }

      try {
        // 全書籍を取得
        const response = await fetch('/api/books?limit=1000')
        if (!response.ok) {
          throw new Error('Failed to fetch books')
        }
        const data = await response.json()
        const allBooks = data.books || []

        // 同じタグを持つ書籍をフィルタリング（現在の書籍を除く）
        const booksWithSameTags = allBooks.filter((b: Book) => {
          if (b.id === book.id) return false // 現在の書籍を除外
          if (!b.tags || b.tags.length === 0) return false
          // 少なくとも1つのタグが一致するかチェック
          return b.tags.some(tag => book.tags!.includes(tag))
        })

        // ランダムに並び替えて最大5件まで取得
        const shuffled = booksWithSameTags.sort(() => Math.random() - 0.5)
        const limited = shuffled.slice(0, 5)
        
        setRelatedBooks(limited)
      } catch (err) {
        console.error('Error fetching related books:', err)
        setRelatedBooks([])
      }
    }

    fetchRelatedBooks()
  }, [book])

  // メモ一覧を取得
  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const response = await fetch(`/api/memos?book_id=${params.id}&limit=3`)
        if (!response.ok) {
          throw new Error('Failed to fetch memos')
        }
        const data = await response.json()
        setMemos(data.memos || [])
      } catch (err) {
        console.error('Error fetching memos:', err)
        setMemos([])
      }
    }

    fetchMemos()
  }, [params.id])

  const handleDeleteMemo = async (memoId: string) => {
    if (!confirm('このメモを削除してもよろしいですか？')) {
      return
    }

    setDeletingMemoId(memoId)

    try {
      const response = await fetch(`/api/memos/${memoId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete memo')
      }

      // メモリストから削除
      setMemos(memos.filter(memo => memo.id !== memoId))
    } catch (err) {
      console.error('Error deleting memo:', err)
      alert('メモの削除に失敗しました')
    } finally {
      setDeletingMemoId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const totalSlides = relatedBooks.length

  const nextSlide = () => {
    if (totalSlides === 0) return
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    if (totalSlides === 0) return
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
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
  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">エラーが発生しました</h2>
              <p className="text-gray-600">{error || '書籍が見つかりません'}</p>
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
          {/* Book Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Book Image */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                {book.asin ? (
                  <div className="w-24 h-32 md:w-32 md:h-40">
                    <img
                      src={generateAmazonImageUrl(book.asin, 'medium')}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-xl shadow-lg"
                      onError={(e) => {
                        // 画像読み込みエラー時はデフォルトアイコンを表示
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const fallback = target.nextElementSibling as HTMLElement
                        if (fallback) fallback.style.display = 'flex'
                      }}
                    />
                    <div className="w-24 h-32 md:w-32 md:h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center hidden">
                      <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-primary-600" />
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-32 md:w-32 md:h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-primary-600" />
                  </div>
                )}
              </div>
              
              {/* Book Details */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {book.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-6">
                  {book.author}
                </p>
                
                {/* Book Summary */}
                {book.description && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">書籍の概要</h3>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                )}

                {/* Book Tags */}
                {book.tags && book.tags.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">タグ</h3>
                    <div className="flex flex-wrap gap-2">
                      {book.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Links */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">書籍のリンク</h3>
                    <button
                      onClick={() => setIsAffiliateMode(!isAffiliateMode)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isAffiliateMode
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {isAffiliateMode ? 'アフィリエイトをOFFにする' : 'アフィリエイトOFF'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {book.amazon_paper_url && (
                      <a
                        href={resolveBookLink(book.amazon_paper_url, book.asin, isAffiliateMode)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium text-gray-700">紙の本</span>
                        <ExternalLink className="w-5 h-5 text-gray-500" />
                      </a>
                    )}
                    
                    {book.amazon_ebook_url && (
                      <a
                        href={resolveBookLink(book.amazon_ebook_url, book.asin, isAffiliateMode)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium text-gray-700">電子書籍</span>
                        <ExternalLink className="w-5 h-5 text-gray-500" />
                      </a>
                    )}
                    
                    {book.amazon_audiobook_url && (
                      <a
                        href={resolveBookLink(book.amazon_audiobook_url, book.asin, isAffiliateMode)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium text-gray-700">オーディオブック</span>
                        <ExternalLink className="w-5 h-5 text-gray-500" />
                      </a>
                    )}
                    
                    {book.summary_text_url && (
                      <a
                        href={book.summary_text_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium text-gray-700">要約（テキスト）</span>
                        <ExternalLink className="w-5 h-5 text-gray-500" />
                      </a>
                    )}

                    {book.summary_video_url && (
                      <a
                        href={book.summary_video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium text-gray-700">要約（動画）</span>
                        <ExternalLink className="w-5 h-5 text-gray-500" />
                      </a>
                    )}

                    {book.recommended_by_post_url && (
                      <a
                        href={book.recommended_by_post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium text-gray-700">推薦ポスト</span>
                        <ExternalLink className="w-5 h-5 text-gray-500" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Memo List */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">メモ一覧</h2>
              {user && (
                <Link
                  href={`/books/${params.id}/memos/new`}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>メモを作成</span>
                </Link>
              )}
            </div>
            
            {memos.length > 0 ? (
              <div className="space-y-6">
                {memos.map((memo) => (
                  <div key={memo.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            {memo.is_public ? (
                              <Globe className="w-4 h-4 text-green-600" />
                            ) : (
                              <Lock className="w-4 h-4 text-gray-600" />
                            )}
                            <span className="text-sm font-medium text-gray-600">
                              {memo.is_public ? '公開' : '非公開'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(memo.created_at)}</span>
                          </div>
                          {memo.user_profiles && (
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <User className="w-4 h-4" />
                              <span>{memo.user_profiles.name || '名無しさん'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {user && memo.user_id === user.id && (
                        <div className="flex items-center space-x-2 ml-4">
                          <Link
                            href={`/books/${params.id}/memos/${memo.id}/edit`}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="編集"
                          >
                            <Edit2 className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteMemo(memo.id)}
                            disabled={deletingMemoId === memo.id}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                            title="削除"
                          >
                            {deletingMemoId === memo.id ? (
                              <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {memo.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">まだメモがありません</p>
                {user && (
                  <Link
                    href={`/books/${params.id}/memos/new`}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>最初のメモを作成</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Related Books Slider - 関連書籍が1件以上ある場合のみ表示 */}
          {relatedBooks.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                こんな本も一緒に見られています
              </h2>
              
              <div className="relative">
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {relatedBooks.map((relatedBook) => (
                      <div key={relatedBook.id} className="w-full flex-shrink-0">
                        <div className="flex justify-center">
                          <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow max-w-sm w-full">
                            <div className="flex flex-col items-center text-center">
                              {/* 書籍画像 */}
                              {relatedBook.asin ? (
                                <div className="w-20 h-24 mb-6">
                                  <img
                                    src={generateAmazonImageUrl(relatedBook.asin)}
                                    alt={relatedBook.title}
                                    className="w-full h-full object-cover rounded-lg shadow-md"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.style.display = 'none'
                                      const fallback = target.nextElementSibling as HTMLElement
                                      if (fallback) fallback.style.display = 'flex'
                                    }}
                                  />
                                  <div className="w-20 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center hidden">
                                    <BookOpen className="w-10 h-10 text-primary-600" />
                                  </div>
                                </div>
                              ) : (
                                <div className="w-20 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mb-6">
                                  <BookOpen className="w-10 h-10 text-primary-600" />
                                </div>
                              )}
                              
                              <Link href={`/books/${relatedBook.id}`} className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-primary-600 transition-colors">
                                {relatedBook.title}
                              </Link>
                              <p className="text-base text-gray-600 mb-4">
                                {relatedBook.author}
                              </p>
                              
                              {/* Tags */}
                              {relatedBook.tags && relatedBook.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 justify-center mb-6">
                                  {relatedBook.tags.slice(0, 3).map((tag, tagIndex) => (
                                    <span
                                      key={tagIndex}
                                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {relatedBooks.length > 1 && (
                  <>
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
                  </>
                )}
              </div>
              
              {relatedBooks.length > 1 && (
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
