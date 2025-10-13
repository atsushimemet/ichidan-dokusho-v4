'use client'

import Navigation from '@/components/Navigation'
import { Book } from '@/types/database'
import { ArrowDown, BookOpen, CheckCircle, ChevronLeft, ChevronRight, ExternalLink, Twitter } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type OnboardingOption = {
  id: string
  label: string
  description?: string
}

type OnboardingQuestion = {
  id: number
  question: string
  helperText?: string
  options: OnboardingOption[]
}

type Predicate = (book: Book) => boolean

const FALLBACK_BOOKS: Book[] = [
  {
    id: 'fallback-1',
    title: '思考の整理学',
    author: '外山滋比古',
    description:
      '東大・京大で最も読まれた思考法の名著。知的生産を高めるための発想術をやさしく解説します。',
    tags: ['思考法', '学習法', '仕事術'],
    asin: '4480020470',
    category: null,
    cover_image_url: null,
    recommended_by: null,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    amazon_paper_url: 'https://www.amazon.co.jp/dp/4480020470',
    amazon_ebook_url: 'https://www.amazon.co.jp/dp/B00J8XQZ8K',
    amazon_audiobook_url: undefined,
    summary_text_url: undefined,
    summary_video_url: undefined,
    recommended_by_post_url: undefined,
  },
  {
    id: 'fallback-2',
    title: 'アウトプット大全',
    author: '樺沢紫苑',
    description: 'インプットを成果につなげるための実践的アウトプット術を紹介。',
    tags: ['アウトプット', '仕事術', '自己啓発'],
    asin: '4046047622',
    category: null,
    cover_image_url: null,
    recommended_by: null,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    amazon_paper_url: 'https://www.amazon.co.jp/dp/4046047622',
    amazon_ebook_url: 'https://www.amazon.co.jp/dp/B07D4BQZ8K',
    amazon_audiobook_url: undefined,
    summary_text_url: undefined,
    summary_video_url: undefined,
    recommended_by_post_url: undefined,
  },
  {
    id: 'fallback-3',
    title: 'デジタル時代の読書術',
    author: '佐藤優',
    description: 'デジタル時代における知識のインプットと活用法を考察する一冊。',
    tags: ['テクノロジー', '読書術', 'ライフハック'],
    asin: '4040820000',
    category: null,
    cover_image_url: null,
    recommended_by: null,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    amazon_paper_url: 'https://www.amazon.co.jp/dp/4040820000',
    amazon_ebook_url: 'https://www.amazon.co.jp/dp/B00J8XQZ8K',
    amazon_audiobook_url: undefined,
    summary_text_url: undefined,
    summary_video_url: undefined,
    recommended_by_post_url: undefined,
  },
]

const DEFAULT_TAGS = ['学習法', '仕事術', 'ライフハック', 'キャリア', 'テクノロジー', 'アウトプット']

const formatOptionDefs: Array<OnboardingOption & { predicate: Predicate }> = [
  {
    id: 'paper',
    label: '紙の本で読みたい',
    description: 'Amazonの紙の本リンクがある書籍',
    predicate: (book) => Boolean(book.amazon_paper_url),
  },
  {
    id: 'ebook',
    label: '電子書籍で読みたい',
    description: 'Kindleなど電子版リンクがある書籍',
    predicate: (book) => Boolean(book.amazon_ebook_url),
  },
  {
    id: 'audio',
    label: 'オーディオブックで学びたい',
    description: 'オーディオブックのリンクがある書籍',
    predicate: (book) => Boolean(book.amazon_audiobook_url),
  },
  {
    id: 'format_any',
    label: '形式は問わない',
    description: 'フォーマットを限定せず表示',
    predicate: () => true,
  },
]

const supportOptionDefs: Array<OnboardingOption & { predicate: Predicate }> = [
  {
    id: 'summary_text',
    label: '要約テキストで復習したい',
    description: '要約テキストへのリンクがある書籍',
    predicate: (book) => Boolean(book.summary_text_url),
  },
  {
    id: 'summary_video',
    label: '動画で理解を深めたい',
    description: '解説動画へのリンクがある書籍',
    predicate: (book) => Boolean(book.summary_video_url),
  },
  {
    id: 'recommended_post',
    label: 'おすすめポストで雰囲気を掴みたい',
    description: '推薦ポストへのリンクがある書籍',
    predicate: (book) => Boolean(book.recommended_by_post_url),
  },
  {
    id: 'support_any',
    label: '特にこだわりはない',
    description: 'サポート機能を限定せず表示',
    predicate: () => true,
  },
]

function generateAmazonImageUrl(asin: string, size: 'large' | 'medium' | 'small' = 'medium') {
  const sizeMap = {
    large: 'SL500',
    medium: 'SL160',
    small: 'SL110',
  }
  return `https://images-na.ssl-images-amazon.com/images/P/${asin}.09_${sizeMap[size]}_.jpg`
}

function BookImage({ book }: { book: Book }) {
  if (!book.asin) {
    return (
      <div className="w-24 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
        <BookOpen className="w-12 h-12 text-primary-600" />
      </div>
    )
  }

  return (
    <div className="w-24 h-32 rounded-lg overflow-hidden shadow-md">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={generateAmazonImageUrl(book.asin, 'medium')}
        alt={book.title}
        className="h-full w-full object-cover"
        onError={(event) => {
          const target = event.target as HTMLImageElement
          target.style.display = 'none'
        }}
      />
    </div>
  )
}

export default function OnboardingPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | null>>({
    1: null,
    2: null,
    3: null,
  })
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/books?limit=1000', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('書籍データの取得に失敗しました')
        }
        const data = await response.json()
        setBooks(data.books || [])
      } catch (err) {
        console.error(err)
        setBooks(FALLBACK_BOOKS)
        setError('書籍データの取得に失敗しました。サンプルデータを表示しています。')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  useEffect(() => {
    if (!showPopup) return undefined
    const timer = window.setTimeout(() => setShowPopup(false), 1600)
    return () => window.clearTimeout(timer)
  }, [showPopup])

  const tagOptionList = useMemo<OnboardingOption[]>(() => {
    if (!books.length) {
      return [
        { id: 'any', label: '幅広く知りたい', description: 'タグを問わずおすすめを表示' },
        ...DEFAULT_TAGS.map((tag) => ({
          id: tag,
          label: tag,
        })),
      ]
    }

    const frequency = new Map<string, number>()
    books.forEach((book) => {
      book.tags?.forEach((tag) => {
        const trimmed = tag.trim()
        if (!trimmed) return
        frequency.set(trimmed, (frequency.get(trimmed) ?? 0) + 1)
      })
    })

    const sorted = Array.from(frequency.entries())
      .sort((a, b) => {
        if (b[1] === a[1]) {
          return a[0].localeCompare(b[0], 'ja')
        }
        return b[1] - a[1]
      })
      .slice(0, 6)
      .map(([tag]) => ({
        id: tag,
        label: tag,
      }))

    return [
      { id: 'any', label: '幅広く知りたい', description: 'タグを問わずおすすめを表示' },
      ...(sorted.length ? sorted : DEFAULT_TAGS.map((tag) => ({ id: tag, label: tag }))),
    ]
  }, [books])

  const questions = useMemo<OnboardingQuestion[]>(
    () => [
      {
        id: 1,
        question: '興味のあるテーマを選んでください',
        helperText: '現在登録されている書籍タグから人気のものをピックアップしています',
        options: tagOptionList,
      },
      {
        id: 2,
        question: 'よく利用する読書スタイルは？',
        helperText: '普段使うフォーマットを選んでください',
        options: formatOptionDefs,
      },
      {
        id: 3,
        question: '学びを定着させるサポートは？',
        helperText: '復習スタイルに合うものを選んでください',
        options: supportOptionDefs,
      },
    ],
    [tagOptionList],
  )

  const currentQuestion = questions[currentStep - 1]
  const isLastStep = currentStep === questions.length

  const handleAnswerSelect = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentStep]: optionId,
    }))
  }

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const computeRecommendations = () => {
    const tagSelection = selectedAnswers[1]
    const formatSelection = selectedAnswers[2]
    const supportSelection = selectedAnswers[3]

    let filtered = [...books]

    if (tagSelection && tagSelection !== 'any') {
      filtered = filtered.filter((book) => book.tags?.includes(tagSelection))
    }

    if (formatSelection) {
      const formatPredicate = formatOptionDefs.find((option) => option.id === formatSelection)?.predicate
      if (formatPredicate && formatSelection !== 'format_any') {
        filtered = filtered.filter(formatPredicate)
      }
    }

    if (supportSelection) {
      const supportPredicate = supportOptionDefs.find((option) => option.id === supportSelection)?.predicate
      if (supportPredicate && supportSelection !== 'support_any') {
        filtered = filtered.filter(supportPredicate)
      }
    }

    if (!filtered.length && tagSelection && tagSelection !== 'any') {
      filtered = books.filter((book) => book.tags?.includes(tagSelection))
    }

    if (!filtered.length && formatSelection && formatSelection !== 'format_any') {
      const formatPredicate = formatOptionDefs.find((option) => option.id === formatSelection)?.predicate
      if (formatPredicate) {
        filtered = books.filter(formatPredicate)
      }
    }

    if (!filtered.length && supportSelection && supportSelection !== 'support_any') {
      const supportPredicate = supportOptionDefs.find((option) => option.id === supportSelection)?.predicate
      if (supportPredicate) {
        filtered = books.filter(supportPredicate)
      }
    }

    return filtered.slice(0, 8)
  }

  const handleComplete = () => {
    const recommendations = computeRecommendations()
    setRecommendedBooks(recommendations)
    setIsCompleted(true)
    setShowPopup(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectedOptionId = selectedAnswers[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">パーソナライズ設定</h1>
            <p className="text-lg text-gray-600">
              3つの質問に答えると、あなたに合った書籍と学習方法をご提案します
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
              {error}
            </div>
          )}

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex justify-center items-center space-x-4 mb-8">
              {questions.map((question, index) => (
                <div key={question.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      index + 1 <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < questions.length - 1 && (
                    <div
                      className={`w-8 h-0.5 mx-2 ${
                        index + 1 < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
                書籍データを読み込んでいます...
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                    Q{currentStep} {currentQuestion.question}
                  </h3>
                  {currentQuestion.helperText && (
                    <p className="text-sm text-gray-500 mb-6">{currentQuestion.helperText}</p>
                  )}

                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleAnswerSelect(option.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-colors ${
                          selectedOptionId === option.id
                            ? 'border-primary-500 bg-primary-50 text-primary-800'
                            : 'border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedOptionId === option.id
                                ? 'border-primary-500 bg-primary-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {selectedOptionId === option.id && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{option.label}</p>
                            {option.description && (
                              <p className="text-sm text-gray-500">{option.description}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>前へ</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="button"
                    onClick={isLastStep ? handleComplete : handleNext}
                    disabled={!selectedOptionId}
                    className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isLastStep ? '結果を見る' : '次へ'}</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {isCompleted && (
            <div className="mt-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  あなたへのおすすめ
                </h2>
                <p className="text-lg text-gray-600">
                  選択内容に沿って、知識を定着させやすい書籍をピックアップしました
                </p>
              </div>

              {recommendedBooks.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {recommendedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-lg"
                    >
                      <div className="mb-6 flex flex-col items-center text-center">
                        <BookImage book={book} />
                        <h3 className="mt-4 text-lg font-semibold text-gray-900">{book.title}</h3>
                        <p className="text-sm text-gray-600">{book.author}</p>
                      </div>

                      {book.tags && book.tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap justify-center gap-2">
                          {book.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mb-6 space-y-2 text-sm text-gray-700">
                        {book.amazon_paper_url && (
                          <a
                            href={book.amazon_paper_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                          >
                            <span>紙の本で読む</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {book.amazon_ebook_url && (
                          <a
                            href={book.amazon_ebook_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                          >
                            <span>電子書籍で読む</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {book.amazon_audiobook_url && (
                          <a
                            href={book.amazon_audiobook_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                          >
                            <span>オーディオブックで学ぶ</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {book.summary_text_url && (
                          <a
                            href={book.summary_text_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                          >
                            <span>要約テキストを見る</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {book.summary_video_url && (
                          <a
                            href={book.summary_video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                          >
                            <span>解説動画を見る</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <a
                          href={`https://x.com/search?q=${encodeURIComponent(book.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                        >
                          <span>Xポストを見る</span>
                          <Twitter className="h-4 w-4" />
                        </a>
                      </div>

                      <Link
                        href={`/books/${book.id}`}
                        className="mt-auto inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
                      >
                        詳細を見る
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg">
                  <p className="text-gray-700">
                    条件に一致する書籍が見つかりませんでした。別の組み合わせでもう一度お試しください。
                  </p>
                </div>
              )}

              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1)
                    setSelectedAnswers({ 1: null, 2: null, 3: null })
                    setIsCompleted(false)
                    setShowPopup(false)
                  }}
                  className="inline-flex items-center space-x-2 rounded-xl border border-primary-600 px-6 py-3 text-primary-600 transition-colors hover:bg-primary-50"
                >
                  <span>条件を変更する</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md animate-fade-in rounded-2xl bg-white p-8 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">設定完了！</h3>
              <p className="mb-6 text-lg text-gray-600">
                あなたの回答に基づくおすすめを表示しました。
                <br />
                下にスクロールしてご確認ください。
              </p>
              <div className="flex flex-col items-center">
                <div className="mb-4 text-sm text-gray-500">スクロールして結果を見る</div>
                <div className="animate-bounce">
                  <ArrowDown className="h-8 w-8 text-primary-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
