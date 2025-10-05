'use client'

import { BookOpen, ChevronDown, ChevronLeft, ChevronUp, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// メモ詳細データ
const memoDetailData = {
  id: 1,
  bookTitle: '思考の整理学',
  bookAuthor: '外山滋比古',
  bookImage: '/api/placeholder/200/300', // 実際の画像URLに置き換え
  memoTitle: '思考の外化について',
  memoAuthor: '田中太郎',
  readContent: '思考を整理するためには、頭の中の思考を一度外に出すことが重要だと学んだ。これは「思考の外化」と呼ばれる手法で、紙に書いたり、人に話したりすることで、客観的に自分の思考を見つめ直すことができる。特に創造的な発想が必要な時には、この手法が非常に効果的であることが分かった。',
  learnedContent: '実際に試してみると、頭の中だけで考えている時よりも、はるかに整理された思考ができるようになった。思考の外化により、自分の考えを客観視できるようになり、より論理的で創造的な発想が可能になった。今後は重要な決断や創造的な作業を行う際には、必ずこの手法を使うようにしたい。',
  quiz: {
    question: '「思考の外化」において最も重要な要素は何か？',
    options: [
      '思考を完璧に整理すること',
      '思考を一度外に出すこと',
      '思考を他人に理解してもらうこと',
      '思考を記録に残すこと'
    ],
    correctAnswer: 1,
    explanation: '思考の外化では、完璧な整理よりも「思考を一度外に出す」ことが最も重要です。紙に書いたり、人に話したりすることで、客観的に自分の思考を見つめ直すことができます。'
  }
}

export default function MemoDetailPage({ params }: { params: { id: string } }) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isAnswerOpen, setIsAnswerOpen] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleShowAnswer = () => {
    setShowAnswer(true)
    setIsAnswerOpen(true)
  }

  const handleRetry = () => {
    window.location.reload()
  }

  const isCorrect = selectedAnswer === memoDetailData.quiz.correctAnswer

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
            
            <Link href="/memos" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span>メモ一覧に戻る</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Book Info */}
          <div className="bg-white rounded-2xl p-4 md:p-8 shadow-lg border border-gray-100 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-8">
              {/* Book Image */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-32 h-40 md:w-48 md:h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-10 h-10 md:w-16 md:h-16 text-primary-600" />
                </div>
              </div>
              
              {/* Book Details */}
              <div className="flex-1 text-left">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {memoDetailData.bookTitle}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-4">{memoDetailData.bookAuthor}</p>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                  {memoDetailData.memoTitle}
                </h2>
                <p className="text-sm md:text-base text-gray-500">
                  メモ作成者: {memoDetailData.memoAuthor}
                </p>
              </div>
            </div>
          </div>

          {/* Memo Content */}
          <div className="bg-white rounded-2xl p-4 md:p-8 shadow-lg border border-gray-100 mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">メモ</h3>
            
            {/* 読んだこと */}
            <div className="mb-6 md:mb-8">
              <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">3.1. 読んだこと</h4>
              <div className="bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200">
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  {memoDetailData.readContent}
                </p>
              </div>
            </div>

            {/* 学んだこと・感じたこと */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">3.2. 学んだこと・感じたこと</h4>
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <p className="text-gray-700 leading-relaxed">
                  {memoDetailData.learnedContent}
                </p>
              </div>
            </div>
          </div>

          {/* Quiz Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">4. 4択クイズ</h3>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                {memoDetailData.quiz.question}
              </h4>
              
              <div className="space-y-3">
                {memoDetailData.quiz.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showAnswer}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      selectedAnswer === index
                        ? showAnswer
                          ? index === memoDetailData.quiz.correctAnswer
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : 'border-red-500 bg-red-50 text-red-800'
                          : 'border-primary-500 bg-primary-50 text-primary-800'
                        : showAnswer && index === memoDetailData.quiz.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${showAnswer ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index
                          ? showAnswer
                            ? index === memoDetailData.quiz.correctAnswer
                              ? 'border-green-500 bg-green-500'
                              : 'border-red-500 bg-red-500'
                            : 'border-primary-500 bg-primary-500'
                          : showAnswer && index === memoDetailData.quiz.correctAnswer
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswer === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                        {showAnswer && index === memoDetailData.quiz.correctAnswer && selectedAnswer !== index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedAnswer !== null && !showAnswer && (
              <button
                onClick={handleShowAnswer}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                回答を見る
              </button>
            )}
          </div>

          {/* Answer Accordion */}
          {showAnswer && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <button
                onClick={() => setIsAnswerOpen(!isAnswerOpen)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-xl font-semibold text-gray-900">5. 回答を見る</h3>
                {isAnswerOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {isAnswerOpen && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-200 pt-6">
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">5.1. 回答番号と解説</h4>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`px-4 py-2 rounded-lg font-semibold ${
                          isCorrect 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isCorrect ? '正解！' : '不正解'}
                        </div>
                        <div className="text-lg font-medium text-gray-700">
                          正解: {memoDetailData.quiz.correctAnswer + 1}番
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h5 className="font-semibold text-gray-800 mb-3">解説:</h5>
                      <p className="text-gray-700 leading-relaxed">
                        {memoDetailData.quiz.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Retry Button */}
          {showAnswer && (
            <div className="mt-8 text-center">
              <button
                onClick={handleRetry}
                className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                <RotateCcw className="w-5 h-5" />
                <span>もう一度</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
