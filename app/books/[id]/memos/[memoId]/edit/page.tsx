'use client'

import Navigation from '@/components/Navigation'
import { useAuth } from '@/hooks/useAuth'
import { Memo } from '@/types/database'
import { ArrowLeft, Loader2, Lock, Unlock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useMemo, useState } from 'react'

interface MemoEditPageProps {
  params: {
    id: string
    memoId: string
  }
}

export default function MemoEditPage({ params }: MemoEditPageProps) {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [memo, setMemo] = useState<Memo | null>(null)
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitState, setSubmitState] = useState<'saving' | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const isRedirecting = useMemo(() => !authLoading && !user, [authLoading, user])

  useEffect(() => {
    if (isRedirecting) {
      router.replace(`/login?redirect=${encodeURIComponent(`/books/${params.id}/memos/${params.memoId}/edit`)}`)
    }
  }, [isRedirecting, params.id, params.memoId, router])

  useEffect(() => {
    const controller = new AbortController()

    const fetchMemo = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/memos/${params.memoId}`, {
          signal: controller.signal
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'メモの取得に失敗しました')
        }

        const memoData: Memo = data.memo

        if (memoData.book_id !== params.id) {
          throw new Error('指定された書籍のメモではありません')
        }

        setMemo(memoData)
        setContent(memoData.content || '')
        setIsPublic(!!memoData.is_public)
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return
        }
        setError(err instanceof Error ? err.message : 'メモの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchMemo()
    }

    return () => {
      controller.abort()
    }
  }, [params.id, params.memoId, user])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitState) {
      return
    }
    if (!content.trim()) {
      setSubmitError('メモ内容を入力してください。')
      return
    }

    setSubmitError(null)
    setSubmitState('saving')

    try {
      const response = await fetch(`/api/memos/${params.memoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          is_public: isPublic
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'メモの更新に失敗しました')
      }

      router.push(`/books/${params.id}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'メモの更新に失敗しました')
    } finally {
      setSubmitState(null)
    }
  }

  if (authLoading || isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navigation />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <div>
            <Link
              href={`/books/${params.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="h-4 w-4" />
              書籍ページに戻る
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">メモを編集</h1>
            <p className="mt-2 text-sm text-gray-600">
              メモ内容と公開設定を更新できます。公開をオフにすると、自分のみ閲覧できる状態になります。
            </p>

            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
              {loading ? (
                <div className="flex items-center gap-3 text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>メモを読み込んでいます...</span>
                </div>
              ) : error ? (
                <p className="text-sm text-red-600">{error}</p>
              ) : memo ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">対象書籍</p>
                  {memo.books ? (
                    <>
                      <p className="text-lg font-semibold text-gray-900">{memo.books.title}</p>
                      <p className="text-sm text-gray-500">{memo.books.author}</p>
                    </>
                  ) : null}
                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(memo.created_at).toLocaleString('ja-JP')}
                  </div>
                </div>
              ) : null}
            </div>

            {(!loading && !error && memo) && (
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="memo-content" className="block text-sm font-medium text-gray-700">
                    メモ
                  </label>
                  <textarea
                    id="memo-content"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    rows={10}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    placeholder="修正したい内容を記入してください。"
                    required
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">公開設定</p>
                  <p className="text-xs text-gray-500">
                    公開をオンにすると他のユーザーにもメモが表示されます。
                  </p>
                  <div className="mt-4 flex flex-col gap-3 md:flex-row">
                    <button
                      type="button"
                      onClick={() => setIsPublic(true)}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors md:w-auto ${
                        isPublic
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700'
                      }`}
                    >
                      <Unlock className="h-4 w-4" />
                      公開
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPublic(false)}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors md:w-auto ${
                        !isPublic
                          ? 'border-gray-600 bg-gray-100 text-gray-800'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Lock className="h-4 w-4" />
                      非公開
                    </button>
                  </div>
                </div>

                {submitError && (
                  <p className="text-sm text-red-600">{submitError}</p>
                )}

                <div className="flex flex-col gap-3 md:flex-row">
                  <button
                    type="submit"
                    disabled={submitState !== null}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                  >
                    {submitState === 'saving' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>保存中...</span>
                      </>
                    ) : (
                      '変更を保存'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/books/${params.id}`)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 md:w-auto"
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
