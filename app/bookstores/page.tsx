'use client'

import Navigation from '@/components/Navigation'
import { useStores } from '@/hooks/useStores'
import { ChevronRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function BookstoresPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  
  // 書店データを取得
  const { stores, loading, error } = useStores()

  // 全タグを取得（カテゴリタグから）
  const allTags = Array.from(new Set(
    stores.flatMap(store => 
      store.category_tags?.map(ct => ct.category_tag.display_name) || []
    )
  ))

  // フィルタリングされた書店
  const filteredStores = selectedTag 
    ? stores.filter(store => 
        store.category_tags?.some(ct => ct.category_tag.display_name === selectedTag)
      )
    : stores

  const totalSlides = filteredStores.length

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

  // ローディング状態
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">書店情報を読み込み中...</h2>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // エラー状態
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">エラーが発生しました</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation />

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
                「{selectedTag}」でフィルタ中 ({filteredStores.length}件)
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
                  {filteredStores.map((store) => (
                    <div key={store.id} className="w-full flex-shrink-0">
                      <div className="flex justify-center">
                        <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow max-w-lg w-full">
                          <div className="flex flex-col">
                            {/* Store Name and Area */}
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

                            {/* Description */}
                            <div className="mb-6">
                              <p className="text-gray-700 leading-relaxed">
                                {store.description || '説明はありません'}
                              </p>
                            </div>

                            {/* Links */}
                            <div className="mb-4 space-y-2">
                              {store.website_link && (
                                <a 
                                  href={store.website_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block text-primary-600 hover:text-primary-800 text-sm underline"
                                >
                                  🌐 ウェブサイト
                                </a>
                              )}
                              {store.google_map_link && (
                                <a 
                                  href={store.google_map_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block text-primary-600 hover:text-primary-800 text-sm underline"
                                >
                                  🗺️ Google Map
                                </a>
                              )}
                            </div>

                            {/* Category Tags */}
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
