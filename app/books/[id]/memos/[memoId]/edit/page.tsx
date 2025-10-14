'use client'

import Navigation from '@/components/Navigation'
import { useAuth } from '@/hooks/useAuth'
import { BookOpen, Save, Lock, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Book {
  id: string
  title: string
  author: string
}

interface Memo {
  id: string
  book_id: string
  user_id: string
  content: string
  is_public: boolean
}

export default function EditMemoPage({ 
  params 
}: { 
  params: { id: string; memoId: string } 
}) {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [book, setBook] = useState<Book | null>(null)
  const [memo, setMemo] = useState<Memo | null>(null)
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 認証チェック
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // メモと書籍情報を取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        // メモ情報を取得
        const memoResponse = await fetch(`/api/memos/${params.memoId}`)
        if (!memoResponse.ok) {
          throw new Error('Failed to fetch memo')
        }
        const memoData = await memoResponse.json()
        
        // ユーザーが所有者でない場合はリダイレクト
        if (user && memoData.memo.user_id !== user.id) {
          router.push(`/books/${params.id}`)
          return
        }

        setMemo(memoData.memo)
        setContent(memoData.memo.content)
        setIsPublic(memoData.memo.is_public)

        // 書籍情報を取得
        const bookResponse = await fetch(`/api/books/${params.id}`)
        if (!bookResponse.ok) {
          throw new Error('Failed to fetch book')
        }
        const bookData = await bookResponse.json()
        setBook(bookData.book)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('データの取得に失敗しました')
      }
    }

    if (user) {
      fetchData()
    }
  }, [params.id, params.memoId, user, router])

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('メモを入力してください')
      return
    }

    if (!user) {
      setError('ログインが必要です')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/memos/${params.memoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          is_public: isPublic,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update memo')
      }

      // メモ更新成功後、書籍詳細ページにリダイレクト
      router.push(`/books/${params.id}`)
    } catch (err) {
      console.error('Error updating memo:', err)
      setError('メモの更新に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">読み込み中...</h2>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* ヘッダー */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              メモを編集
            </h1>
            {book && (
              <div className="flex items-center space-x-3 text-gray-600">
                <BookOpen className="w-5 h-5" />
                <div>
                  <p className="font-semibold text-gray-900">{book.title}</p>
                  <p className="text-sm">{book.author}</p>
                </div>
              </div>
            )}
          </div>

          {/* メモフォーム */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                メモ
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="書籍についてのメモを入力してください..."
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-gray-900"
                disabled={isSubmitting}
              />
            </div>

            {/* 公開設定 */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                公開設定
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsPublic(true)}
                  disabled={isSubmitting}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isPublic
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  <Globe className="w-5 h-5" />
                  <span>公開</span>
                </button>
                <button
                  onClick={() => setIsPublic(false)}
                  disabled={isSubmitting}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    !isPublic
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  <Lock className="w-5 h-5" />
                  <span>非公開</span>
                </button>
              </div>
            </div>

            {/* 保存ボタン */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>更新中...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>更新する</span>
                  </>
                )}
              </button>
            </div>

            {/* キャンセルボタン */}
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push(`/books/${params.id}`)}
                disabled={isSubmitting}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors disabled:opacity-50"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

