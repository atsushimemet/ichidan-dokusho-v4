'use client'

import { BookOpen, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function BookstoresPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // 本屋データ（ホーム画面と同じ）
  const bookstores = [
    {
      id: 1,
      name: '代官山 蔦屋書店',
      location: '東京都渋谷区猿楽町17-5',
      description: '代官山の街並みに溶け込む、世界で最も美しい書店の一つとして知られる蔦屋書店。本だけでなく、音楽、映画、雑貨など、生活に寄り添う商品を幅広く取り揃えています。',
      tags: ['大型書店', '文化施設', 'カフェ併設']
    },
    {
      id: 2,
      name: '神保町 三省堂書店',
      location: '東京都千代田区神田神保町1-1',
      description: '神保町の老舗書店として知られる三省堂書店。学術書から一般書まで幅広いジャンルの本を取り扱い、研究者や学生に愛されています。',
      tags: ['学術書', '老舗', '専門書']
    },
    {
      id: 3,
      name: '丸善 丸の内本店',
      location: '東京都千代田区丸の内1-6-4',
      description: '丸の内のビジネス街に位置する丸善本店。ビジネス書から文芸書まで、ビジネスパーソンに人気の書籍を豊富に取り揃えています。',
      tags: ['ビジネス書', '文芸書', 'ビジネス街']
    },
    {
      id: 4,
      name: '紀伊國屋書店 新宿本店',
      location: '東京都新宿区新宿3-17-7',
      description: '新宿の繁華街に位置する紀伊國屋書店新宿本店。最新のベストセラーから古典まで、幅広いジャンルの本を楽しめます。',
      tags: ['ベストセラー', '新刊', '繁華街']
    },
    {
      id: 5,
      name: '有隣堂 横浜本店',
      location: '神奈川県横浜市西区南幸1-5-1',
      description: '横浜の老舗書店として親しまれている有隣堂本店。地域密着型の書店として、地元の人々に愛され続けています。',
      tags: ['地域密着', '老舗', '横浜']
    },
    {
      id: 6,
      name: 'ジュンク堂書店 池袋本店',
      location: '東京都豊島区南池袋1-28-2',
      description: '池袋の大型書店として知られるジュンク堂書店。豊富な在庫と充実した品揃えで、読書愛好家に人気です。',
      tags: ['大型書店', '豊富な在庫', '池袋']
    },
    {
      id: 7,
      name: 'TSUTAYA 六本木店',
      location: '東京都港区六本木6-11-1',
      description: '六本木のTSUTAYA店舗。本、DVD、CDなど、エンターテイメント全般を楽しめる複合店舗です。',
      tags: ['複合店舗', 'エンターテイメント', '六本木']
    },
    {
      id: 8,
      name: 'BOOKOFF 新宿店',
      location: '東京都新宿区歌舞伎町1-17-1',
      description: '中古本の宝庫として知られるBOOKOFF新宿店。掘り出し物を見つける楽しみがあります。',
      tags: ['中古本', '掘り出し物', '新宿']
    },
    {
      id: 9,
      name: '文教堂 吉祥寺店',
      location: '東京都武蔵野市吉祥寺本町1-1-1',
      description: '吉祥寺の文教堂書店。地域の読書文化を支える書店として、幅広い年齢層に愛されています。',
      tags: ['地域書店', '読書文化', '吉祥寺']
    },
    {
      id: 10,
      name: '未来屋書店 渋谷店',
      location: '東京都渋谷区道玄坂2-29-19',
      description: '渋谷の未来屋書店。若者向けの書籍から専門書まで、幅広いジャンルを取り扱っています。',
      tags: ['若者向け', '専門書', '渋谷']
    }
  ]

  // 全タグを取得
  const allTags = Array.from(new Set(bookstores.flatMap(bookstore => bookstore.tags)))

  // フィルタリングされた本屋
  const filteredBookstores = selectedTag 
    ? bookstores.filter(bookstore => bookstore.tags.includes(selectedTag))
    : bookstores

  const totalSlides = filteredBookstores.length

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag)
    setCurrentSlide(0) // フィルタ変更時に最初のスライドに戻る
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2663eb' }}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">一段読書</span>
                <p className="text-xs text-gray-500 -mt-1">Knowledge Loop Edition</p>
              </div>
            </Link>
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span>ホームに戻る</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              店舗一覧
            </h1>
            <p className="text-lg text-gray-600">
              おすすめの書店をチェックして、あなたの読書体験を豊かにしましょう
            </p>
          </div>

          {/* Tag Filter */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">タグでフィルタ</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTagSelect(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === null
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                すべて
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
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
            {selectedTag && (
              <div className="mt-4 text-sm text-gray-600">
                「{selectedTag}」でフィルタ中 ({filteredBookstores.length}件)
              </div>
            )}
          </div>

          {/* Bookstores Slider */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {filteredBookstores.map((bookstore) => (
                    <div key={bookstore.id} className="w-full flex-shrink-0">
                      <div className="flex justify-center">
                        <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow max-w-lg w-full">
                          <div className="flex flex-col">
                            {/* Bookstore Name and Location */}
                            <div className="mb-6">
                              <Link href={`/bookstores/${bookstore.id}`} className="text-2xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                                {bookstore.name}
                              </Link>
                              <div className="flex items-center text-gray-600">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span className="text-base">{bookstore.location}</span>
                              </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                              <p className="text-gray-700 leading-relaxed">
                                {bookstore.description}
                              </p>
                            </div>

                            {/* Tags */}
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
      </div>
    </div>
  )
}
