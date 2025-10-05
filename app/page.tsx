'use client'

import BookList from '@/components/BookList'
import MemoForm from '@/components/MemoForm'
import Navigation from '@/components/Navigation'
import QuizSection from '@/components/QuizSection'
import { ArrowRight, BarChart3, BookOpen, Brain, Clock, FileText, HelpCircle, RefreshCw, Target, TrendingUp } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'books' | 'memo' | 'quiz'>('books')

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
                  <button className="bg-white text-blue-600 hover:bg-gray-50 font-semibold py-2 px-4 md:px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap text-sm md:text-base">
                    はじめる
                  </button>
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
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
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
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
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
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
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

      {/* Main Content Tabs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                今すぐ始める
              </h2>
              <p className="text-lg text-gray-600">
                以下の機能を使って、効率的な読書学習を始めましょう
              </p>
            </div>
            
            <div className="flex justify-center mb-12">
              <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
                <button
                  onClick={() => setActiveTab('books')}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === 'books'
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  書籍一覧
                </button>
                <button
                  onClick={() => setActiveTab('memo')}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === 'memo'
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  メモ作成
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === 'quiz'
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  クイズ
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {activeTab === 'books' && <BookList />}
              {activeTab === 'memo' && <MemoForm />}
              {activeTab === 'quiz' && <QuizSection />}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
