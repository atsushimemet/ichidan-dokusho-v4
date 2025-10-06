'use client'

import Navigation from '@/components/Navigation'
import { BarChart3, BookOpen, FileText, LogOut, Settings, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminDashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // 初期化時にログイン状態をチェック
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminLoggedIn') === 'true'
    }
    return false
  })

  // ログイン状態のチェック（初回のみ）
  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = '/admin/login'
    }
  }, [isLoggedIn])

  const handleLogout = () => {
    // localStorageからログイン状態を削除
    localStorage.removeItem('adminLoggedIn')
    setIsLoggedIn(false)
    // ログインページにリダイレクト
    window.location.href = '/admin/login'
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ログインが必要です</h2>
              <Link
                href="/admin/login"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                ログインページへ
              </Link>
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">
                管理者ダッシュボード
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                システムの管理と監視を行います
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">ログアウト</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">クイックアクション</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/admin/books/add"
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                <BookOpen className="w-5 h-5" />
                <span>新しい書籍を登録</span>
              </Link>
              <Link
                href="/admin/bookstores/add"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                <Settings className="w-5 h-5" />
                <span>新しい書店を登録</span>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総ユーザー数</p>
                  <p className="text-3xl font-bold text-gray-900">1,234</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総書籍数</p>
                  <p className="text-3xl font-bold text-gray-900">567</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総メモ数</p>
                  <p className="text-3xl font-bold text-gray-900">2,890</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">アクティブ率</p>
                  <p className="text-3xl font-bold text-gray-900">78%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Management Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Management */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">ユーザー管理</h2>
              </div>
              <p className="text-gray-600 mb-6">
                ユーザーアカウントの管理、権限設定、アクティビティの監視を行います。
              </p>
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <h3 className="font-semibold text-gray-900">ユーザー一覧</h3>
                  <p className="text-sm text-gray-600">全ユーザーの一覧と詳細情報</p>
                </button>
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <h3 className="font-semibold text-gray-900">新規ユーザー承認</h3>
                  <p className="text-sm text-gray-600">新規登録ユーザーの承認待ち</p>
                </button>
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <h3 className="font-semibold text-gray-900">ユーザー統計</h3>
                  <p className="text-sm text-gray-600">ユーザーの活動状況と分析</p>
                </button>
              </div>
            </div>

            {/* Content Management */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">コンテンツ管理</h2>
              </div>
              <p className="text-gray-600 mb-6">
                書籍、メモ、レビューの管理とモデレーションを行います。
              </p>
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <h3 className="font-semibold text-gray-900">書籍管理</h3>
                  <p className="text-sm text-gray-600">書籍情報の追加・編集・削除</p>
                </button>
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <h3 className="font-semibold text-gray-900">メモ管理</h3>
                  <p className="text-sm text-gray-600">ユーザーメモの監視とモデレーション</p>
                </button>
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <h3 className="font-semibold text-gray-900">コンテンツ統計</h3>
                  <p className="text-sm text-gray-600">コンテンツの利用状況と分析</p>
                </button>
              </div>
            </div>

            {/* System Settings */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">システム設定</h2>
              </div>
              <p className="text-gray-600 mb-6">
                システムの設定、メンテナンス、セキュリティ管理を行います。
              </p>
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <h3 className="font-semibold text-gray-900">一般設定</h3>
                  <p className="text-sm text-gray-600">サイトの基本設定とカスタマイズ</p>
                </button>
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <h3 className="font-semibold text-gray-900">セキュリティ</h3>
                  <p className="text-sm text-gray-600">セキュリティ設定とアクセス制御</p>
                </button>
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <h3 className="font-semibold text-gray-900">バックアップ</h3>
                  <p className="text-sm text-gray-600">データのバックアップと復元</p>
                </button>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">分析・レポート</h2>
              </div>
              <p className="text-gray-600 mb-6">
                システムの利用状況、パフォーマンス、ユーザー行動の分析を行います。
              </p>
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <h3 className="font-semibold text-gray-900">利用統計</h3>
                  <p className="text-sm text-gray-600">日別・月別の利用状況レポート</p>
                </button>
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <h3 className="font-semibold text-gray-900">パフォーマンス</h3>
                  <p className="text-sm text-gray-600">システムのパフォーマンス監視</p>
                </button>
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <h3 className="font-semibold text-gray-900">エラーログ</h3>
                  <p className="text-sm text-gray-600">システムエラーの監視と分析</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
