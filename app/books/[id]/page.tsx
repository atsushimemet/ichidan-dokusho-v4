'use client'

import Navigation from '@/components/Navigation'
import { useAuth } from '@/hooks/useAuth'
import { useBookMemos } from '@/hooks/useBookMemos'
import { BookOpen, Calendar, ChevronRight, ExternalLink, Loader2, PencilLine, PlusCircle, Sparkles, Trash2, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

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

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [book, setBook] = useState<Book | null>(null)
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAffiliateMode, setIsAffiliateMode] = useState(true)
  const { user, isLoading: authLoading } = useAuth()
  const {
    memos,
    loading: memosLoading,
    error: memosError,
    refresh: refreshMemos
  } = useBookMemos(params.id, 3)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deletingMemoId, setDeletingMemoId] = useState<string | null>(null)
  const [confirmingMemoId, setConfirmingMemoId] = useState<string | null>(null)
  const [chatGPTMemoId, setChatGPTMemoId] = useState<string | null>(null)
  const [chatGPTError, setChatGPTError] = useState<string | null>(null)
  const chatGPTTimerRef = useRef<NodeJS.Timeout | null>(null)

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

  const totalSlides = relatedBooks.length

  const handleCreateMemo = () => {
    router.push(`/books/${params.id}/memos/new`)
  }

  const handleEditMemo = (memoId: string) => {
    router.push(`/books/${params.id}/memos/${memoId}/edit`)
  }

  const requestDeleteMemo = (memoId: string) => {
    setDeleteError(null)
    setConfirmingMemoId(memoId)
  }

  const handleDeleteMemo = async (memoId: string) => {
    try {
      setDeleteError(null)
      setDeletingMemoId(memoId)
      const response = await fetch(`/api/memos/${memoId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete memo')
      }

      refreshMemos()
      setConfirmingMemoId(null)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'メモの削除に失敗しました')
    } finally {
      setDeletingMemoId(null)
    }
  }

  const handleChatGPTExport = (memoId: string, content: string) => {
    setChatGPTError(null)
    if (chatGPTTimerRef.current) {
      clearTimeout(chatGPTTimerRef.current)
      chatGPTTimerRef.current = null
    }
    setChatGPTMemoId(memoId)

    const formattedContent = [
      '# メタプロンプト 以下のメモから要点を抽出、メモを整理して500文字以内のテキストで整理されたメモを出力して下さい。箇条書きは禁止し、段落形式で記述して下さい。',
      '# メモ',
      content
    ].join('\n')

    chatGPTTimerRef.current = setTimeout(async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(formattedContent)
        } else {
          const textarea = document.createElement('textarea')
          textarea.value = formattedContent
          textarea.style.position = 'fixed'
          textarea.style.left = '-9999px'
          document.body.appendChild(textarea)
          textarea.focus()
          textarea.select()
          document.execCommand('copy')
          document.body.removeChild(textarea)
        }
      } catch (err) {
        console.error('Failed to copy memo content:', err)
        setChatGPTError('メモのコピーに失敗しました。手動でコピーしてください。')
      } finally {
        chatGPTTimerRef.current = null
        setChatGPTMemoId(null)
        window.open('https://chatgpt.com/', '_blank', 'noopener,noreferrer')
      }
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (chatGPTTimerRef.current) {
        clearTimeout(chatGPTTimerRef.current)
      }
    }
  }, [])

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
    <>
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">メモ一覧</h2>
              {user ? (
                <button
                  onClick={handleCreateMemo}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>メモを作成する</span>
                </button>
              ) : (
                !authLoading && (
                  <p className="text-sm text-gray-500">
                    ログインするとメモを作成できます。
                  </p>
                )
              )}
            </div>

            {deleteError && (
              <p className="mb-4 text-sm text-red-600">{deleteError}</p>
            )}

            {chatGPTError && (
              <p className="mb-4 text-sm text-red-600">{chatGPTError}</p>
            )}

            {memosError && (
              <p className="mb-4 text-sm text-red-600">メモの取得に失敗しました。</p>
            )}

            {memosLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
              </div>
            ) : memos.length === 0 ? (
              <p className="text-sm text-gray-600">
                公開されているメモはまだありません。
              </p>
            ) : (
              <div className="space-y-6">
                {memos.map((memo) => {
                  const isOwner = user?.id === memo.user_id
                  const createdAt = memo.created_at
                    ? new Date(memo.created_at).toLocaleDateString('ja-JP')
                    : ''

                  return (
                    <div
                      key={memo.id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 font-medium ${
                                memo.is_public
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}
                            >
                              {memo.is_public ? '公開' : '非公開'}
                            </span>
                            {createdAt && (
                              <div className="flex items-center gap-1 text-gray-500">
                                <Calendar className="h-4 w-4" />
                                <span>{createdAt}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                            <User className="h-4 w-4" />
                            <span>{isOwner ? 'あなたのメモ' : '読者のメモ'}</span>
                          </div>
                        </div>

                        {isOwner && (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEditMemo(memo.id)}
                              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                              aria-label="メモを編集する"
                            >
                              <PencilLine className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleChatGPTExport(memo.id, memo.content)}
                              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                              aria-label="ChatGPTでメモを整形する"
                            >
                              <Sparkles className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => requestDeleteMemo(memo.id)}
                              disabled={deletingMemoId === memo.id}
                              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                              aria-label="メモを削除する"
                            >
                              {deletingMemoId === memo.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                          {memo.content}
                        </p>
                      </div>
                    </div>
                  )
                })}
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

    {confirmingMemoId && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-900">メモを削除しますか？</h3>
          <p className="mt-2 text-sm text-gray-600">
            この操作は取り消せません。メモを削除すると元に戻せないことを確認してください。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                if (!deletingMemoId) {
                  setConfirmingMemoId(null)
                }
              }}
              className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 sm:w-auto"
            >
              キャンセル
            </button>
            <button
              type="button"
              disabled={!!deletingMemoId}
              onClick={() => confirmingMemoId && handleDeleteMemo(confirmingMemoId)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {deletingMemoId === confirmingMemoId ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>削除中...</span>
                </>
              ) : (
                '削除する'
              )}
            </button>
          </div>
        </div>
      </div>
    )}
    {chatGPTMemoId && (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900/40 px-4 py-8 sm:py-0">
        <div className="w-full max-w-lg rounded-2xl border border-primary-200 bg-white px-6 py-5 text-center shadow-2xl">
          <p className="text-sm font-medium leading-relaxed text-gray-900 sm:text-base">
            この後ChatGPTに遷移します。遷移後メモをペーストできるのでペーストしてChatGPTに送信して下さい。作成されたアウトプットをコピーし、あなたのメモを更新して下さい。
          </p>
        </div>
      </div>
    )}
    </>
  )
}
