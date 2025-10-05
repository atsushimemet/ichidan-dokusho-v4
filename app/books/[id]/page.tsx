'use client'

import { BookOpen, Calendar, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Navigation from '@/components/Navigation'

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // 書籍詳細データ
  const bookDetailData = {
    id: params.id,
    title: '思考の整理学',
    author: '外山滋比古',
    summary: '思考を整理し、創造的な発想を生み出すための方法論を解説した名著。特に「思考の外化」の重要性と、知識を体系化する技術について詳しく述べられている。',
    amazonLink: 'https://amazon.co.jp/dp/4480020470',
    kindleLink: 'https://amazon.co.jp/dp/B00J8XQZ8K',
    audibleLink: 'https://amazon.co.jp/dp/B00J8XQZ8K',
    summaryLink: 'https://example.com/summary1'
  }

  // メモ一覧データ
  const memos = [
    {
      id: 1,
      title: '思考の外化について',
      readContent: '思考を外部に書き出すことで、より客観的に自分の考えを整理できるという内容。',
      learnedContent: '思考の外化は単なる記録ではなく、思考プロセス自体を可視化する重要な技術だと理解した。',
      createdAt: '2024年1月15日',
      author: '田中太郎'
    },
    {
      id: 2,
      title: '知識の体系化',
      readContent: '知識を体系的に整理し、関連性を見つけることで新しい発想が生まれるという話。',
      learnedContent: '知識の断片を組み合わせることで、予想もしなかった新しいアイデアが生まれることを実感した。',
      createdAt: '2024年1月10日',
      author: '佐藤花子'
    },
    {
      id: 3,
      title: '創造的思考のプロセス',
      readContent: '創造的な思考には段階があり、準備期、潜伏期、啓示期、検証期があるという内容。',
      learnedContent: '創造的なアイデアは突然降ってくるものではなく、段階的なプロセスを経て生まれることを学んだ。',
      createdAt: '2024年1月5日',
      author: '山田次郎'
    }
  ]

  // 関連書籍データ
  const relatedBooks = [
    {
      id: 1,
      title: 'アウトプット大全',
      author: '樺沢紫苑',
      tags: ['自己啓発', 'アウトプット', '学習法']
    },
    {
      id: 2,
      title: 'デジタル時代の読書術',
      author: '佐藤優',
      tags: ['読書術', 'デジタル', '情報処理']
    },
    {
      id: 3,
      title: '知的生産の技術',
      author: '梅棹忠夫',
      tags: ['知的生産', '情報整理', '研究法']
    },
    {
      id: 4,
      title: '思考の整理学',
      author: '外山滋比古',
      tags: ['思考法', '整理術', '創造性']
    },
    {
      id: 5,
      title: '読書について',
      author: 'ショーペンハウアー',
      tags: ['読書論', '哲学', '古典']
    }
  ]

  const totalSlides = relatedBooks.length

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
          {/* Book Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Book Image */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-24 h-32 md:w-32 md:h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-primary-600" />
                </div>
              </div>
              
              {/* Book Details */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {bookDetailData.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-6">
                  {bookDetailData.author}
                </p>
                
                {/* Book Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">書籍の概要</h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {bookDetailData.summary}
                  </p>
                </div>

                {/* Book Links */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">書籍のリンク</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                      href={bookDetailData.amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-gray-700">紙の本</span>
                      <ExternalLink className="w-5 h-5 text-gray-500" />
                    </a>
                    
                    <a
                      href={bookDetailData.kindleLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-gray-700">電子書籍</span>
                      <ExternalLink className="w-5 h-5 text-gray-500" />
                    </a>
                    
                    <a
                      href={bookDetailData.audibleLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-gray-700">オーディオブック</span>
                      <ExternalLink className="w-5 h-5 text-gray-500" />
                    </a>
                    
                    <a
                      href={bookDetailData.summaryLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-gray-700">要約</span>
                      <ExternalLink className="w-5 h-5 text-gray-500" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Memo List */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">メモ一覧</h2>
            
            <div className="space-y-6">
              {memos.map((memo) => (
                <div key={memo.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {memo.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{memo.createdAt}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{memo.author}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">2.1. 読んだこと</h4>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {memo.readContent}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">2.2. 学んだこと・感じたこと</h4>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {memo.learnedContent}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href={`/memos/${memo.id}`}
                      className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                      詳細を見る
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Books Slider */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              こんな本も一緒に見られています
            </h2>
            
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {relatedBooks.map((book) => (
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
                              {book.author}
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
