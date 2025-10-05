'use client'

import Navigation from '@/components/Navigation'
import { ArrowRight, BarChart3, BookOpen, Brain, ChevronRight, Clock, FileText, HelpCircle, MapPin, RefreshCw, Target, TrendingUp, Twitter } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'books' | 'memo' | 'quiz'>('books')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentBookstoreSlide, setCurrentBookstoreSlide] = useState(0)

  // おすすめ書籍データ
  const recommendedBooks = [
    { id: 1, title: '思考の整理学', recommender: '田中太郎', xPost: 'https://x.com/example1', tags: ['思考法', '整理術', '創造性'] },
    { id: 2, title: 'アウトプット大全', recommender: '佐藤花子', xPost: 'https://x.com/example2', tags: ['学習法', 'アウトプット', '記憶'] },
    { id: 3, title: 'デジタル時代の読書術', recommender: '山田次郎', xPost: 'https://x.com/example3', tags: ['読書術', 'デジタル', '情報処理'] },
    { id: 4, title: '習慣の力', recommender: '鈴木一郎', xPost: 'https://x.com/example4', tags: ['習慣', '心理学', '行動科学'] },
    { id: 5, title: '深い学び', recommender: '高橋美咲', xPost: 'https://x.com/example5', tags: ['学習理論', '認知科学', '教育'] },
    { id: 6, title: 'クリエイティブ思考', recommender: '伊藤健太', xPost: 'https://x.com/example6', tags: ['創造性', 'イノベーション', '発想法'] },
    { id: 7, title: '時間管理術', recommender: '渡辺さくら', xPost: 'https://x.com/example7', tags: ['時間管理', '生産性', '効率化'] },
    { id: 8, title: '集中力の科学', recommender: '中村大輔', xPost: 'https://x.com/example8', tags: ['集中力', '脳科学', 'パフォーマンス'] },
    { id: 9, title: '記憶術大全', recommender: '小林あい', xPost: 'https://x.com/example9', tags: ['記憶術', '暗記法', '学習効率'] },
    { id: 10, title: '学習の技法', recommender: '加藤雄一', xPost: 'https://x.com/example10', tags: ['学習法', 'スキルアップ', '自己啓発'] },
  ]

  const booksPerSlide = 1
  const totalSlides = recommendedBooks.length

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  // 本屋データ
  const bookstores = [
    { 
      id: 1, 
      name: '蔦屋書店 代官山店', 
      location: '東京都渋谷区', 
      description: '世界で最も美しい書店の一つ。建築と本が融合した空間で、新しい読書体験を提供します。',
      tags: ['建築', 'カフェ', 'アート']
    },
    { 
      id: 2, 
      name: '神保町古書センター', 
      location: '東京都千代田区', 
      description: '古書の聖地として知られる老舗書店。貴重な古書から最新刊まで幅広く取り揃えています。',
      tags: ['古書', '歴史', '専門書']
    },
    { 
      id: 3, 
      name: '本屋B&B', 
      location: '東京都世田谷区', 
      description: '本とビールが楽しめるユニークな書店。読書会やイベントも頻繁に開催されています。',
      tags: ['イベント', 'ビール', 'コミュニティ']
    },
    { 
      id: 4, 
      name: '森岡書店', 
      location: '東京都中央区', 
      description: '1週間に1冊だけを売る革新的な書店。店主の厳選された一冊との出会いが待っています。',
      tags: ['厳選', '店主推薦', '限定']
    },
    { 
      id: 5, 
      name: 'ブックファースト 新宿店', 
      location: '東京都新宿区', 
      description: '新宿の中心地にある大型書店。最新のベストセラーから専門書まで豊富な品揃えです。',
      tags: ['大型', 'ベストセラー', 'アクセス良好']
    },
    { 
      id: 6, 
      name: '三省堂書店 神保町本店', 
      location: '東京都千代田区', 
      description: '神保町の老舗書店。学術書や専門書の品揃えが充実しており、研究者にも愛されています。',
      tags: ['学術書', '専門書', '老舗']
    },
    { 
      id: 7, 
      name: '代官山 蔦屋書店', 
      location: '東京都渋谷区', 
      description: '代官山のランドマーク的存在。本、音楽、映画が融合した複合文化施設です。',
      tags: ['複合施設', '音楽', '映画']
    },
    { 
      id: 8, 
      name: '丸善 丸の内本店', 
      location: '東京都千代田区', 
      description: '丸の内のビジネス街にある老舗書店。ビジネス書や実用書の品揃えが特に充実しています。',
      tags: ['ビジネス書', '実用書', 'ビジネス街']
    },
    { 
      id: 9, 
      name: 'ジュンク堂書店 池袋本店', 
      location: '東京都豊島区', 
      description: '池袋の大型書店。文芸書から実用書まで幅広いジャンルをカバーしています。',
      tags: ['文芸書', '実用書', '大型']
    },
    { 
      id: 10, 
      name: '有隣堂 横浜店', 
      location: '神奈川県横浜市', 
      description: '横浜の老舗書店。地域に根ざした書店として、地元の人々に愛され続けています。',
      tags: ['地域密着', '老舗', '横浜']
    }
  ]

  const totalBookstoreSlides = bookstores.length

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* メモカード1 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      思考の整理学
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">外山滋比古</p>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                      思考を整理し、創造的な発想を生み出すための方法論について学んだ。特に「思考の外化」の重要性を理解できた。
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">2024年1月15日</span>
                      <Link href="/memos/1" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        詳細を見る
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* メモカード2 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      アウトプット大全
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">樺沢紫苑</p>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                      学んだことを確実に身につけるためのアウトプット術について。特に「2週間に3回のアウトプット」の法則が印象的だった。
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">2024年1月10日</span>
                      <Link href="/memos/2" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        詳細を見る
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                            <div className="w-20 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mb-6">
                              <BookOpen className="w-10 h-10 text-primary-600" />
                            </div>
                            <Link href={`/books/${book.id}`} className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-primary-600 transition-colors">
                              {book.title}
                            </Link>
                            <p className="text-base text-gray-600 mb-4">
                              推薦者: {book.recommender}
                            </p>
                            
                            {/* タグ */}
                            <div className="flex flex-wrap gap-2 justify-center mb-6">
                              {book.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
        </div>

                            <a
                              href={book.xPost}
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
              {/* スライダーコンテナ */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentBookstoreSlide * 100}%)` }}
                >
                  {bookstores.map((bookstore) => (
                    <div key={bookstore.id} className="w-full flex-shrink-0">
                      <div className="flex justify-center">
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow max-w-lg w-full border border-gray-100">
                          <div className="flex flex-col">
                            {/* 本屋名と場所 */}
                            <div className="mb-6">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {bookstore.name}
                              </h3>
                              <div className="flex items-center text-gray-600">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span className="text-base">{bookstore.location}</span>
                              </div>
                            </div>

                            {/* 一言紹介 */}
                            <div className="mb-6">
                              <p className="text-gray-700 leading-relaxed">
                                {bookstore.description}
                              </p>
                            </div>

                            {/* タグ */}
                            <div className="flex flex-wrap gap-2">
                              {bookstore.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
                                >
                                  {tag}
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
