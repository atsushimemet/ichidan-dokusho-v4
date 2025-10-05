'use client'

import { ArrowDown, BookOpen, CheckCircle, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | null }>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  // おすすめ書籍データ
  const recommendedBooks = [
    {
      id: 1,
      title: '思考の整理学',
      author: '外山滋比古',
      amazonLink: 'https://amazon.co.jp/dp/4480020470',
      kindleLink: 'https://amazon.co.jp/dp/B00J8XQZ8K',
      audibleLink: 'https://amazon.co.jp/dp/B00J8XQZ8K',
      summaryLink: 'https://example.com/summary1'
    },
    {
      id: 2,
      title: 'アウトプット大全',
      author: '樺沢紫苑',
      amazonLink: 'https://amazon.co.jp/dp/4046047622',
      kindleLink: 'https://amazon.co.jp/dp/B07D4BQZ8K',
      audibleLink: 'https://amazon.co.jp/dp/B07D4BQZ8K',
      summaryLink: 'https://example.com/summary2'
    },
    {
      id: 3,
      title: 'デジタル時代の読書術',
      author: '佐藤優',
      amazonLink: 'https://amazon.co.jp/dp/4040820000',
      kindleLink: 'https://amazon.co.jp/dp/B00J8XQZ8K',
      audibleLink: 'https://amazon.co.jp/dp/B00J8XQZ8K',
      summaryLink: 'https://example.com/summary3'
    }
  ]

  const questions = [
    {
      id: 1,
      question: 'どのような目的の本を読むことが多いですか？',
      options: [
        '仕事術',
        'お金',
        'プログラミング',
        '歴史',
        'データサイエンス',
        'その他'
      ]
    },
    {
      id: 2,
      question: '1日にどのくらいの時間を読書に使いますか？',
      options: [
        '15分未満',
        '15-30分',
        '30分-1時間',
        '1-2時間',
        '2時間以上'
      ]
    },
    {
      id: 3,
      question: 'どのような読書方法を好みますか？',
      options: [
        '紙の本でじっくり読む',
        '電子書籍で読む',
        'オーディオブックで聞く',
        '要約や解説を読む',
        '複数の方法を組み合わせる'
      ]
    }
  ]

  const currentQuestion = questions[currentStep - 1]
  const isLastStep = currentStep === questions.length
  const isFirstStep = currentStep === 1

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentStep]: answerIndex
    }))
  }

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    // オンボーディング完了後の処理
    console.log('Onboarding completed:', selectedAnswers)
    setShowPopup(true)
    
    // 1秒後にポップアップを非表示にして、おすすめ書籍を表示
    setTimeout(() => {
      setShowPopup(false)
      setIsCompleted(true)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2663eb' }}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">一段読書</span>
                <p className="text-xs text-gray-500 -mt-1">Knowledge Loop Edition</p>
              </div>
            </div>
            
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span>ホームに戻る</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              パーソナライズ設定
            </h1>
            
            {/* Progress Steps */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              {questions.map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    index + 1 <= currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  {index < questions.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      index + 1 < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              あなたの読書スタイルを教えてください
            </h2>
            <p className="text-lg text-gray-600">
              3つの質問であなたにぴったりの本を見つけます
            </p>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="mb-8">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
                Q{currentStep} {currentQuestion.question}
              </h3>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      selectedAnswers[currentStep] === index
                        ? 'border-primary-500 bg-primary-50 text-primary-800'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentStep] === index
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswers[currentStep] === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {!isFirstStep && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>前へ</span>
                </button>
              )}

              <div className={isFirstStep ? 'ml-auto' : ''}>
                {isLastStep ? (
                  <button
                    onClick={handleComplete}
                    disabled={selectedAnswers[currentStep] === null || selectedAnswers[currentStep] === undefined}
                    className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>完了</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={selectedAnswers[currentStep] === null || selectedAnswers[currentStep] === undefined}
                    className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>次へ</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Recommended Books Section */}
          {isCompleted && (
            <div className="mt-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  あなたにおすすめの本
                </h2>
                <p className="text-lg text-gray-600">
                  あなたの読書スタイルに基づいて厳選した3冊をご紹介します
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedBooks.map((book) => (
                  <div key={book.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="text-center mb-6">
                      {/* Book Image */}
                      <div className="w-24 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-12 h-12 text-primary-600" />
                      </div>
                      
                      {/* Book Info */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {book.author}
                      </p>
                    </div>

                    {/* Reading Options */}
                    <div className="space-y-3 mb-6">
                      <h4 className="text-sm font-semibold text-gray-800 mb-3">読み方</h4>
                      
                      <a
                        href={book.amazonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-700">紙の本</span>
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </a>
                      
                      <a
                        href={book.kindleLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-700">電子書籍</span>
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </a>
                      
                      <a
                        href={book.audibleLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-700">オーディオブック</span>
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </a>
                      
                      <a
                        href={book.summaryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-700">要約</span>
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </a>
                    </div>

                    {/* Detail Button */}
                    <Link
                      href={`/memos/${book.id}`}
                      className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                    >
                      詳細を見る
                    </Link>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="text-center mt-8">
                <Link
                  href="/"
                  className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
                >
                  <span>ホームに戻る</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}

          {/* Completion Popup */}
          {showPopup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 mx-4 max-w-md w-full shadow-2xl animate-fade-in">
                <div className="text-center">
                  {/* Success Icon */}
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  
                  {/* Success Message */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    設定完了！
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    あなたの読書スタイルに基づいて<br />
                    おすすめの本を準備しました
                  </p>
                  
                  {/* Arrow Down Animation */}
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-4">下にスクロールしてご確認ください</p>
                    <div className="animate-bounce">
                      <ArrowDown className="w-8 h-8 text-primary-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
