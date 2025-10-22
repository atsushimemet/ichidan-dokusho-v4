'use client'

import Navigation from '@/components/Navigation'
import { useClerkAuth } from '@/hooks/useClerkAuth'
import { Book } from '@/types/database'
import { Loader2, Lock, Unlock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useMemo, useState } from 'react'

interface MemoCreatePageProps {
  params: { id: string }
}

type SubmitVariant = 'public' | 'private' | null

export default function MemoCreatePage({ params }: MemoCreatePageProps) {
  const router = useRouter()
  const { user, clerkUser, isAuthenticated, isLoading: authLoading } = useClerkAuth()
  const [book, setBook] = useState<Book | null>(null)
  const [bookLoading, setBookLoading] = useState(true)
  const [bookError, setBookError] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [submitState, setSubmitState] = useState<SubmitVariant>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const isRedirecting = useMemo(() => !authLoading && !isAuthenticated, [authLoading, isAuthenticated])

  useEffect(() => {
    if (isRedirecting) {
      router.replace(`/login?redirect=${encodeURIComponent(`/books/${params.id}/memos/new`)}`)
    }
  }, [isRedirecting, params.id, router])

  useEffect(() => {
    const controller = new AbortController()

    const fetchBook = async () => {
      try {
        setBookLoading(true)
        const response = await fetch(`/api/books/${params.id}`, {
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error('Failed to fetch book')
        }

        const data = await response.json()
        setBook(data.book)
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return
        }
        setBookError('書籍情報の取得に失敗しました。')
      } finally {
        setBookLoading(false)
      }
    }

    fetchBook()

    return () => {
      controller.abort()
    }
  }, [params.id])

  const submitMemo = async (variant: Exclude<SubmitVariant, null>) => {
    if (submitState) {
      return
    }
    if (!content.trim()) {
      setSubmitError('メモ内容を入力してください。')
      return
    }
    setSubmitError(null)
    setSubmitState(variant)

    try {
      console.log('Submitting memo:', { book_id: params.id, content, is_public: variant === 'public' })
      
      const response = await fetch('/api/memos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          book_id: params.id,
          content,
          is_public: variant === 'public'
        })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        let errorMessage = 'メモの登録に失敗しました'
        try {
          const data = await response.json()
          console.log('Error response data:', data)
          errorMessage = data.error || errorMessage
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log('Success response:', result)
      
      setContent('')
      router.push(`/books/${params.id}`)
    } catch (err) {
      console.error('Memo submission error:', err)
      const errorMessage = err instanceof Error ? err.message : 'メモの登録に失敗しました'
      setSubmitError(errorMessage)
    } finally {
      setSubmitState(null)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await submitMemo('public')
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">認証が必要です</h2>
              <p className="text-gray-600 mb-6">メモを作成するにはログインが必要です。</p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                ログインページへ
              </Link>
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
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">メモを作成</h1>
            <p className="mt-2 text-sm text-gray-600">
              公開設定に応じて、他の読者と共有するか自分専用のメモとして保存できます。
            </p>

            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
              {bookLoading ? (
                <div className="flex items-center gap-3 text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>書籍情報を読み込んでいます...</span>
                </div>
              ) : book ? (
                <div>
                  <p className="text-sm font-medium text-gray-700">対象書籍</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{book.title}</p>
                  <p className="text-sm text-gray-500">{book.author}</p>
                </div>
              ) : (
                <p className="text-sm text-red-600">{bookError}</p>
              )}
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="memo-content" className="block text-sm font-medium text-gray-700">
                  メモ
                </label>
                <textarea
                  id="memo-content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="書籍から得た学びや気づきを記録してください。"
                  rows={10}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                />
              </div>

              {submitError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">エラーが発生しました</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{submitError}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 md:flex-row">
                <button
                  type="submit"
                  disabled={!content.trim() || submitState !== null}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                >
                  {submitState === 'public' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>保存中...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4" />
                      <span>メモを公開する</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => submitMemo('private')}
                  disabled={!content.trim() || submitState !== null}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                >
                  {submitState === 'private' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>保存中...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>公開せず登録する</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
