'use client'

import Navigation from '@/components/Navigation'
import { useBooks } from '@/hooks/useBooks'
import { useMemos } from '@/hooks/useMemos'
import { useStores } from '@/hooks/useStores'
import { ArrowRight, BarChart3, BookOpen, Brain, ChevronRight, Clock, FileText, HelpCircle, MapPin, RefreshCw, Target, TrendingUp, Twitter } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Amazon画像URL生成関数
function generateAmazonImageUrl(asin: string, size: 'large' | 'medium' | 'small' = 'small'): string {
  const sizeMap = {
    large: 'SL500',
    medium: 'SL160',
    small: 'SL110'
  }
  return `http://images.amazon.com/images/P/${asin}.09_${sizeMap[size]}_.jpg`
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'books' | 'memo' | 'quiz'>('books')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentBookstoreSlide, setCurrentBookstoreSlide] = useState(0)

  // データ取得
  const { books: recommendedBooks, loading: booksLoading } = useBooks(10)
  const { stores, loading: storesLoading } = useStores(10)
  const { memos, loading: memosLoading } = useMemos(2)

  const booksPerSlide = 1
  const totalSlides = recommendedBooks.length

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }


  const totalBookstoreSlides = stores.length

  const nextBookstoreSlide = () => {
    setCurrentBookstoreSlide((prev) => (prev + 1) % totalBookstoreSlides)
  }

  const prevBookstoreSlide = () => {
    setCurrentBookstoreSlide((prev) => (prev - 1 + totalBookstoreSlides) % totalBookstoreSlides)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation />
      
      {/* Hero Card */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl p-6 md:p-8 text-white relative overflow-hidden" style={{ backgroundColor: '#2663eb' }}>
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4 md:mr-6">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3 whitespace-nowrap">
                    読書を始めよう
          </h1>
                  <p className="text-base md:text-lg text-blue-100 mb-4 md:mb-6 whitespace-nowrap">
                    あなたの学びをサポートします
                  </p>
                  <Link href="/onboarding" className="inline-block bg-white text-blue-600 hover:bg-gray-50 font-semibold py-2 px-4 md:px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap text-sm md:text-base">
                    はじめる
                  </Link>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
        </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Dashboard */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              学びのダッシュボード
            </h2>
            <div className="grid grid-cols-3 gap-3 md:gap-6">
              {/* メモ数 */}
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-4">
                    <FileText className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <div className="text-lg md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">24</div>
                  <div className="text-xs md:text-base text-gray-600 font-medium">メモ数</div>
                </div>
              </div>

              {/* クイズ数 */}
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-4">
                    <HelpCircle className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
                  </div>
                  <div className="text-lg md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">18</div>
                  <div className="text-xs md:text-base text-gray-600 font-medium">クイズ数</div>
                </div>
              </div>

              {/* 正答率 */}
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-100 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-4">
                    <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
                  </div>
                  <div className="text-lg md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">85%</div>
                  <div className="text-xs md:text-base text-gray-600 font-medium">正答率</div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Output Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                みんなのアウトプット
              </h2>
              <Link href="/memos" className="flex items-center space-x-1 md:space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors text-sm md:text-base">
                <span>すべてを見る</span>
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              </Link>
            </div>
            
            {memosLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {memos.map((memo, index) => (
                  <div key={memo.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-20 bg-gradient-to-br ${index === 0 ? 'from-blue-100 to-blue-200' : 'from-green-100 to-green-200'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <BookOpen className={`w-8 h-8 ${index === 0 ? 'text-blue-600' : 'text-green-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {memo.books?.title || '書籍タイトル'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{memo.books?.author || '著者名'}</p>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                          {memo.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {new Date(memo.created_at).toLocaleDateString('ja-JP')}
                          </span>
                          <Link href={`/memos/${memo.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            詳細を見る
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recommended Books Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              おすすめの本
            </h2>
            
            <div className="relative">
              {booksLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <>
                  {/* スライダーコンテナ */}
                  <div className="overflow-hidden">
                    <div 
                      className="flex transition-transform duration-300 ease-in-out"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {recommendedBooks.map((book, index) => (
                        <div key={book.id} className="w-full flex-shrink-0">
                          <div className="flex justify-center">
                            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow max-w-sm w-full">
                              <div className="flex flex-col items-center text-center">
                                {/* 書籍画像またはデフォルトアイコン */}
                                {book.asin ? (
                                  <div className="w-20 h-24 mb-6">
                                    <img
                                      src={generateAmazonImageUrl(book.asin)}
                                      alt={book.title}
                                      className="w-full h-full object-cover rounded-lg shadow-md"
                                      onError={(e) => {
                                        // 画像読み込みエラー時はデフォルトアイコンを表示
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
                                <Link href={`/books/${book.id}`} className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-primary-600 transition-colors">
                                  {book.title}
                                </Link>
                                <p className="text-base text-gray-600 mb-4">
                                  推薦者: {book.recommended_by || 'N/A'}
                                </p>
                                
                                {/* タグ */}
                                <div className="flex flex-wrap gap-2 justify-center mb-6">
                                  {book.tags?.map((tag, tagIndex) => (
                                    <span
                                      key={tagIndex}
                                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>

                                <a
                                  href={`https://x.com/search?q=${encodeURIComponent(book.title)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
                                >
                                  <Twitter className="w-5 h-5" />
                                  <span className="font-medium">Xポストを見る</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ナビゲーションボタン */}
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

            {/* スライダーインジケーター */}
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
      </section>

      {/* Bookstore Slider Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              おすすめの本屋
            </h2>
            
            <div className="relative">
              {storesLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <>
                  {/* スライダーコンテナ */}
                  <div className="overflow-hidden">
                    <div 
                      className="flex transition-transform duration-300 ease-in-out"
                      style={{ transform: `translateX(-${currentBookstoreSlide * 100}%)` }}
                    >
                      {stores.map((store) => (
                        <div key={store.id} className="w-full flex-shrink-0">
                          <div className="flex justify-center">
                            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow max-w-lg w-full border border-gray-100">
                              <div className="flex flex-col">
                                {/* 書店名とエリア */}
                                <div className="mb-6">
                                  <Link href={`/bookstores/${store.id}`} className="text-2xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                                    {store.name}
                                  </Link>
                                  {store.google_map_link ? (
                                    <a 
                                      href={store.google_map_link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center text-gray-600 hover:text-primary-600 transition-colors cursor-pointer"
                                    >
                                      <MapPin className="w-4 h-4 mr-2" />
                                      <span className="text-base">{store.area?.name} ({store.area?.prefecture})</span>
                                    </a>
                                  ) : (
                                    <div className="flex items-center text-gray-600">
                                      <MapPin className="w-4 h-4 mr-2" />
                                      <span className="text-base">{store.area?.name} ({store.area?.prefecture})</span>
                                    </div>
                                  )}
                                </div>

                                {/* 説明 */}
                                <div className="mb-6">
                                  <p className="text-gray-700 leading-relaxed">
                                    {store.description || '説明はありません'}
                                  </p>
                                </div>

                                {/* カテゴリタグ */}
                                <div className="flex flex-wrap gap-2">
                                  {store.category_tags?.map((ct, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
                                    >
                                      {ct.category_tag.display_name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ナビゲーションボタン */}
              <button
                onClick={prevBookstoreSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
              </button>
              <button
                onClick={nextBookstoreSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* スライダーインジケーター */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalBookstoreSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBookstoreSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentBookstoreSlide ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

        {/* Knowledge Loop Visualization */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Knowledge Loop
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              読書から学びの定着まで、一連のプロセスを循環させることで確実な知識習得を実現します
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-4 shadow-lg mx-auto">
                <BookOpen className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">読書</h3>
              <p className="text-gray-600 max-w-xs">本を読み、重要なポイントを記録</p>
            </div>
            
            <div className="hidden md:block">
              <ArrowRight className="w-8 h-8 text-primary-400" />
            </div>
            <div className="md:hidden">
              <ArrowRight className="w-8 h-8 text-primary-400 rotate-90" />
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-4 shadow-lg mx-auto">
                <Brain className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">理解</h3>
              <p className="text-gray-600 max-w-xs">メモを作成し、内容を整理・理解</p>
            </div>
            
            <div className="hidden md:block">
              <ArrowRight className="w-8 h-8 text-primary-400" />
            </div>
            <div className="md:hidden">
              <ArrowRight className="w-8 h-8 text-primary-400 rotate-90" />
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4 shadow-lg mx-auto">
                <Target className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">復習</h3>
              <p className="text-gray-600 max-w-xs">クイズで理解度を確認・定着</p>
            </div>
          </div>
        </div>
      </section>

        {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              実績データ
            </h2>
            <p className="text-lg text-gray-600">
              多くのユーザーに選ばれている理由
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">70%以上</h3>
              <p className="text-gray-600 text-lg">初回クイズ生成率</p>
              <p className="text-sm text-gray-500 mt-2">読書メモから自動でクイズを生成</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">30%以上</h3>
              <p className="text-gray-600 text-lg">リマインダー再アクセス率</p>
              <p className="text-sm text-gray-500 mt-2">定期的な復習で記憶を定着</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">3分以上</h3>
              <p className="text-gray-600 text-lg">平均滞在時間</p>
              <p className="text-sm text-gray-500 mt-2">効率的な学習で短時間で成果</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              主な機能
            </h2>
            <p className="text-lg text-gray-600">
              効率的な読書学習をサポートする機能
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">書籍管理</h3>
              <p className="text-gray-600">読んだ本を整理し、進捗を管理できます</p>
            </div>
            
            <div className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">メモ作成</h3>
              <p className="text-gray-600">重要なポイントを構造化して記録</p>
            </div>
            
            <div className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">クイズ生成</h3>
              <p className="text-gray-600">AIが自動で理解度チェッククイズを作成</p>
          </div>
        </div>
      </div>
      </section>

    </div>
  )
}
