'use client'

import { Brain, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react'
import { useState } from 'react'

interface Quiz {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizResult {
  quizId: string
  selectedAnswer: number
  isCorrect: boolean
  timeSpent: number
}

// サンプルクイズデータ
const sampleQuizzes: Quiz[] = [
  {
    id: '1',
    question: '「思考の整理学」で提唱されている「思考の整理」の基本原則は何か？',
    options: [
      '情報を大量に集めること',
      '思考を一度外に出すこと',
      '完璧を求めること',
      '一人で考えること'
    ],
    correctAnswer: 1,
    explanation: '思考の整理では、頭の中の思考を一度外に出すことで、客観的に整理できるとされています。'
  },
  {
    id: '2',
    question: 'アウトプットの効果を最大化するために重要な要素は？',
    options: [
      '量よりも質',
      '質よりも量',
      '量と質のバランス',
      '完璧な準備'
    ],
    correctAnswer: 2,
    explanation: 'アウトプットは量と質のバランスが重要で、まず量をこなしてから質を高めていくアプローチが効果的です。'
  },
  {
    id: '3',
    question: 'デジタル時代の読書で最も重要なスキルは？',
    options: [
      '速読力',
      '記憶力',
      '批判的思考力',
      '集中力'
    ],
    correctAnswer: 2,
    explanation: '情報が氾濫するデジタル時代では、情報を鵜呑みにせず批判的に思考する能力が最も重要です。'
  }
]

export default function QuizSection() {
  const [quizzes] = useState<Quiz[]>(sampleQuizzes)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({})
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const currentQuiz = quizzes[currentQuizIndex]
  const isLastQuiz = currentQuizIndex === quizzes.length - 1
  const isFirstQuiz = currentQuizIndex === 0

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuiz.id]: answerIndex
    }))
  }

  const handleNext = () => {
    if (isLastQuiz) {
      // クイズ完了
      const results: QuizResult[] = quizzes.map(quiz => ({
        quizId: quiz.id,
        selectedAnswer: selectedAnswers[quiz.id] ?? -1,
        isCorrect: selectedAnswers[quiz.id] === quiz.correctAnswer,
        timeSpent: 0 // 実際の実装では時間を計測
      }))
      setQuizResults(results)
      setIsQuizCompleted(true)
      setShowResults(true)
    } else {
      setCurrentQuizIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstQuiz) {
      setCurrentQuizIndex(prev => prev - 1)
    }
  }

  const handleRestart = () => {
    setCurrentQuizIndex(0)
    setSelectedAnswers({})
    setQuizResults([])
    setIsQuizCompleted(false)
    setShowResults(false)
  }

  const correctAnswers = quizResults.filter(result => result.isCorrect).length
  const accuracy = quizResults.length > 0 ? Math.round((correctAnswers / quizResults.length) * 100) : 0

  if (showResults) {
    return (
      <div>
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">クイズ完了！</h2>
          <p className="text-lg text-gray-600">
            正答率: <span className="font-bold text-primary-600">{accuracy}%</span> ({correctAnswers}/{quizResults.length}問)
          </p>
        </div>

        <div className="space-y-6">
          {quizzes.map((quiz, index) => {
            const result = quizResults.find(r => r.quizId === quiz.id)
            const isCorrect = result?.isCorrect ?? false
            const selectedAnswer = result?.selectedAnswer ?? -1

            return (
              <div key={quiz.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start space-x-3 mb-4">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      問題 {index + 1}: {quiz.question}
                    </h3>
                    <div className="space-y-2">
                      {quiz.options.map((option, optionIndex) => {
                        let optionClass = "p-3 rounded-lg border "
                        if (optionIndex === quiz.correctAnswer) {
                          optionClass += "bg-green-50 border-green-200 text-green-800"
                        } else if (optionIndex === selectedAnswer && !isCorrect) {
                          optionClass += "bg-red-50 border-red-200 text-red-800"
                        } else {
                          optionClass += "bg-gray-50 border-gray-200 text-gray-700"
                        }
                        
                        return (
                          <div key={optionIndex} className={optionClass}>
                            {option}
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>解説:</strong> {quiz.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex justify-center mt-8">
          <button onClick={handleRestart} className="btn-primary flex items-center space-x-2">
            <RotateCcw className="w-4 h-4" />
            <span>もう一度挑戦</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900">理解度チェッククイズ</h2>
      </div>

      {/* プログレスバー */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>問題 {currentQuizIndex + 1} / {quizzes.length}</span>
          <span>{Math.round(((currentQuizIndex + 1) / quizzes.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuizIndex + 1) / quizzes.length) * 100}%` }}
          />
        </div>
      </div>

      {/* クイズ問題 */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuiz.question}
        </h3>
        
        <div className="space-y-3">
          {currentQuiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedAnswers[currentQuiz.id] === index
                  ? 'border-primary-500 bg-primary-50 text-primary-800'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswers[currentQuiz.id] === index
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswers[currentQuiz.id] === index && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ナビゲーションボタン */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={isFirstQuiz}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          前の問題
        </button>
        
        <button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuiz.id] === undefined}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLastQuiz ? '結果を見る' : '次の問題'}
        </button>
      </div>
    </div>
  )
}