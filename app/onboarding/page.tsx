'use client'

import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | null }>({})

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
    // ここでホームページにリダイレクトするか、結果を保存する
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
        <div className="max-w-2xl mx-auto">
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
              <button
                onClick={handlePrevious}
                disabled={isFirstStep}
                className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>前へ</span>
              </button>

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
      </div>
    </div>
  )
}
