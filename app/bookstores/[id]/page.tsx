'use client'

import { BookOpen, Calendar, ChevronLeft, ChevronRight, ExternalLink, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Navigation from '@/components/Navigation'

export default function BookstoreDetailPage({ params }: { params: { id: string } }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // 本屋詳細データ
  const bookstoreDetailData = {
    id: params.id,
    name: '代官山 蔦屋書店',
    location: '東京都渋谷区猿楽町17-5',
    description: '代官山の街並みに溶け込む、世界で最も美しい書店の一つとして知られる蔦屋書店。本だけでなく、音楽、映画、雑貨など、生活に寄り添う商品を幅広く取り揃えています。',
    tags: ['大型書店', '文化施設', 'カフェ併設', 'イベント開催', '雑貨販売'],
    hpLink: 'https://real.tsite.jp/daikanyama/',
    xLink: 'https://twitter.com/tsutaya_daikanyama',
    instagramLink: 'https://www.instagram.com/tsutaya_daikanyama/',
    postLink: 'https://example.com/bookstore-post'
  }

  // イベント情報データ
  const events = [
    {
      id: 1,
      name: '読書会「思考の整理学を読む」',
      description: '外山滋比古の名著「思考の整理学」をテーマにした読書会を開催します。参加者同士で感想を共有し、思考の整理術について深く学び合いましょう。',
      date: '2024年2月15日（土）14:00-16:00',
      capacity: '20名',
      price: '無料'
    },
    {
      id: 2,
      name: '著者トーク「デジタル時代の読書術」',
      description: '佐藤優氏を迎えて、デジタル時代における効果的な読書術についてお話しいただきます。質疑応答の時間も設けています。',
      date: '2024年2月22日（土）19:00-21:00',
      capacity: '50名',
      price: '1,500円'
    },
    {
      id: 3,
      name: '古本市「春の古本まつり」',
      description: '春の訪れを告げる古本まつりを開催します。貴重な古書から最新の文庫本まで、幅広いジャンルの本をお得な価格でお求めいただけます。',
      date: '2024年3月1日（金）- 3月3日（日）10:00-20:00',
      capacity: '制限なし',
      price: '入場無料'
    }
  ]

  const totalSlides = events.length

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Bookstore Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Bookstore Image */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-48 h-64 md:w-56 md:h-72 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-16 h-16 md:w-20 md:h-20 text-green-600" />
                </div>
              </div>
              
              {/* Bookstore Details */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {bookstoreDetailData.name}
                </h1>
                
                {/* Location */}
                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg">{bookstoreDetailData.location}</span>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">本屋タグ</h3>
                  <div className="flex flex-wrap gap-2">
                    {bookstoreDetailData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* About */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{bookstoreDetailData.name}について</h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {bookstoreDetailData.description}
                  </p>
                </div>

                {/* Links */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">リンク</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                      href={bookstoreDetailData.hpLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-gray-700">HPリンク</span>
                      <ExternalLink className="w-5 h-5 text-gray-500" />
                    </a>
                    
                    <a
                      href={bookstoreDetailData.xLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-gray-700">Xリンク</span>
                      <ExternalLink className="w-5 h-5 text-gray-500" />
                    </a>
                    
                    <a
                      href={bookstoreDetailData.instagramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-gray-700">Instagramリンク</span>
                      <ExternalLink className="w-5 h-5 text-gray-500" />
                    </a>
                    
                    <a
                      href={bookstoreDetailData.postLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-gray-700">紹介ポストリンク</span>
                      <ExternalLink className="w-5 h-5 text-gray-500" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Events Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              イベント情報
            </h2>
            
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {events.map((event) => (
                    <div key={event.id} className="w-full flex-shrink-0">
                      <div className="flex justify-center">
                        <div className="bg-gray-50 rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-xl transition-shadow max-w-lg w-full">
                          <div className="flex flex-col">
                            {/* Event Image */}
                            <div className="w-full h-32 md:h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4 md:mb-6">
                              <Calendar className="w-8 h-8 md:w-16 md:h-16 text-blue-600" />
                            </div>
                            
                            {/* Event Info */}
                            <div className="flex-1">
                              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                                {event.name}
                              </h3>
                              
                              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                                <div className="flex items-center text-gray-600">
                                  <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                                  <span className="text-xs md:text-sm">{event.date}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <User className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                                  <span className="text-xs md:text-sm">定員: {event.capacity}</span>
                                </div>
                                <div className="text-gray-600">
                                  <span className="text-xs md:text-sm">参加費: {event.price}</span>
                                </div>
                              </div>

                              {/* Event Description */}
                              <div className="mb-4 md:mb-6">
                                <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-2">イベント概要</h4>
                                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                                  {event.description}
                                </p>
                              </div>

                              {/* Apply Button */}
                              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-colors duration-200 text-sm md:text-base">
                                イベントに申し込む
                              </button>
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
