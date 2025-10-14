'use client'

import Navigation from '@/components/Navigation'
import { useAuth } from '@/hooks/useAuth'
import { BookOpen, Globe, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Book {
  id: string
  title: string
  author: string
}

export default function NewMemoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [book, setBook] = useState<Book | null>(null)
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 認証チェック
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // 書籍情報を取得
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch book')
        }
        const data = await response.json()
        setBook(data.book)
      } catch (err) {
        console.error('Error fetching book:', err)
        setError('書籍情報の取得に失敗しました')
      }
    }

    fetchBook()
  }, [params.id])

  const handleSubmit = async (isPublic: boolean) => {
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
      const response = await fetch('/api/memos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book_id: params.id,
          user_id: user.id,
          content: content.trim(),
          is_public: isPublic,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create memo')
      }

      // メモ作成成功後、書籍詳細ページにリダイレクト
      router.push(`/books/${params.id}`)
    } catch (err) {
      console.error('Error creating memo:', err)
      setError('メモの作成に失敗しました')
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
              メモを作成
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
              <p className="mt-2 text-sm text-gray-500">
                読んだ内容、学んだこと、感じたことなどを自由に記録してください
              </p>
            </div>

            {/* ボタン */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting || !content.trim()}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>作成中...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-5 h-5" />
                    <span>公開する</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting || !content.trim()}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>作成中...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>公開せず登録する</span>
                  </>
                )}
              </button>
            </div>

            {/* ヒント */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">メモについて</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>公開する</strong>：他のユーザーもこのメモを閲覧できます</li>
                    <li>• <strong>公開せず登録する</strong>：自分だけがこのメモを閲覧できます</li>
                    <li>• メモは後から編集・削除することができます</li>
                  </ul>
                </div>
              </div>
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
