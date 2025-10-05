'use client'

import { BookOpen, ChevronLeft, ChevronRight, Twitter } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function BooksPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // 書籍データ（ホーム画面と同じ）
  const books = [
    {
      id: 1,
      title: '思考の整理学',
      recommender: '田中太郎',
      tags: ['思考法', '整理術', '創造性'],
      xPost: 'https://twitter.com/example1'
    },
    {
      id: 2,
      title: 'アウトプット大全',
      recommender: '佐藤花子',
      tags: ['学習法', 'アウトプット', '記憶'],
      xPost: 'https://twitter.com/example2'
    },
    {
      id: 3,
      title: 'デジタル時代の読書術',
      recommender: '山田次郎',
      tags: ['読書術', 'デジタル', '情報処理'],
      xPost: 'https://twitter.com/example3'
    },
    {
      id: 4,
      title: '知的生産の技術',
      recommender: '鈴木一郎',
      tags: ['知的生産', '情報整理', '研究法'],
      xPost: 'https://twitter.com/example4'
    },
    {
      id: 5,
      title: '読書について',
      recommender: '高橋美咲',
      tags: ['読書論', '哲学', '古典'],
      xPost: 'https://twitter.com/example5'
    },
    {
      id: 6,
      title: '本を読む本',
      recommender: '伊藤健太',
      tags: ['読書法', '古典', '名著'],
      xPost: 'https://twitter.com/example6'
    },
    {
      id: 7,
      title: '速読術',
      recommender: '渡辺真理',
      tags: ['速読', '効率化', '学習法'],
      xPost: 'https://twitter.com/example7'
    },
    {
      id: 8,
      title: '記憶術',
      recommender: '中村直樹',
      tags: ['記憶', '学習法', '脳科学'],
      xPost: 'https://twitter.com/example8'
    },
    {
      id: 9,
      title: '集中力',
      recommender: '小林恵子',
      tags: ['集中力', '生産性', '心理学'],
      xPost: 'https://twitter.com/example9'
    },
    {
      id: 10,
      title: '習慣の力',
      recommender: '加藤大輔',
      tags: ['習慣', '自己改善', '心理学'],
      xPost: 'https://twitter.com/example10'
    }
  ]

  const totalSlides = books.length

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
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
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              書籍一覧
            </h1>
            <p className="text-lg text-gray-600">
              おすすめの書籍をチェックして、あなたの読書ライフを豊かにしましょう
            </p>
          </div>

          {/* Books Slider */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {books.map((book) => (
                    <div key={book.id} className="w-full flex-shrink-0">
                      <div className="flex justify-center">
                        <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow max-w-sm w-full">
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
                            
                            {/* Tags */}
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
