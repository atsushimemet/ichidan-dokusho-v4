'use client'

import Navigation from '@/components/Navigation'
import { Memo } from '@/types/database'
import { BookOpen, Calendar, Loader2, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

interface MemoWithBook extends Memo {
  books?: NonNullable<Memo['books']>
}

function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}…`
}

export default function MemoListPage() {
  const [memos, setMemos] = useState<MemoWithBook[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedTag, setSelectedTag] = useState<string>('')

  useEffect(() => {
    const controller = new AbortController()

    const fetchMemos = async () => {
      try {
        setLoading(true)
        setError(null)
        const params = new URLSearchParams({
          visibility: 'public',
          limit: '50'
        })

        const response = await fetch(`/api/memos?${params.toString()}`, {
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error('メモの取得に失敗しました。')
        }

        const data = await response.json()
        setMemos(data.memos ?? [])
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return
        }
        setError(err instanceof Error ? err.message : 'メモの取得に失敗しました。')
      } finally {
        setLoading(false)
      }
    }

    fetchMemos()

    return () => controller.abort()
  }, [])

  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    memos.forEach((memo) => {
      memo.tags?.forEach((tag) => {
        if (tag) {
          tags.add(tag)
        }
      })
    })
    return Array.from(tags).sort()
  }, [memos])

  const filteredMemos = useMemo(() => {
    return memos.filter((memo) => {
      const matchesTag =
        selectedTag === '' || (memo.tags || []).includes(selectedTag)

      if (!matchesTag) {
        return false
      }

      if (searchTerm.trim() === '') {
        return true
      }

      const keyword = searchTerm.trim().toLowerCase()
      const bookMatch = memo.books
        ? `${memo.books.title} ${memo.books.author}`.toLowerCase().includes(keyword)
        : false

      return memo.content.toLowerCase().includes(keyword) || bookMatch
    })
  }, [memos, selectedTag, searchTerm])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation />

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              みんなの読書メモ
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              公開されている読書メモを参考に学びを深めましょう。キーワード検索やタグで絞り込みができます。
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  キーワードで探す
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="書籍タイトル・著者名・メモ内容など"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タグで絞り込む
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTag('')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedTag === ''
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    すべて
                  </button>
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
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
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : filteredMemos.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              条件に一致するメモが見つかりませんでした。
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMemos.map((memo) => (
                <div
                  key={memo.id}
                  className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
                >
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-16 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-100 to-primary-200">
                      <BookOpen className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {memo.books?.title ?? '書籍タイトル'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {memo.books?.author ?? '著者情報'}
                      </p>
                      {memo.tags && memo.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {memo.tags.map((tag, index) => (
                            <span
                              key={`${memo.id}-${tag}-${index}`}
                              className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 flex-1">
                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                      {truncate(memo.content, 180)}
                    </p>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {memo.created_at
                          ? new Date(memo.created_at).toLocaleDateString('ja-JP')
                          : '日付不明'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {memo.is_public ? '公開メモ' : '非公開メモ'}
                      </span>
                    </div>

                    <Link
                      href={`/memos/${memo.id}`}
                      className="inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                    >
                      詳細を見る
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
