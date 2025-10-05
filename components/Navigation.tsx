'use client'

import { BookOpen, LogOut, Menu, User, X } from 'lucide-react'
import { useState } from 'react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // 仮の状態

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2663eb' }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">一段読書</span>
              <p className="text-xs text-gray-500 -mt-1">Knowledge Loop Edition</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-primary-600 font-medium transition-colors relative group">
              ホーム
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
            </a>
            <a href="#" className="text-gray-600 hover:text-primary-600 font-medium transition-colors relative group">
              書籍一覧
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
            </a>
            <a href="#" className="text-gray-600 hover:text-primary-600 font-medium transition-colors relative group">
              学び履歴
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
            </a>
            <a href="#" className="text-gray-600 hover:text-primary-600 font-medium transition-colors relative group">
              設定
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
            </a>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span className="font-medium">ユーザー名</span>
                </div>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>ログアウト</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  ログイン
                </button>
                <button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                  無料で始める
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-600 hover:text-primary-600 font-medium py-2 transition-colors">
                ホーム
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-600 font-medium py-2 transition-colors">
                書籍一覧
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-600 font-medium py-2 transition-colors">
                学び履歴
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-600 font-medium py-2 transition-colors">
                設定
              </a>
              
              <div className="pt-4 border-t border-gray-100">
                {isLoggedIn ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-600 py-2">
                      <User className="w-5 h-5" />
                      <span className="font-medium">ユーザー名</span>
                    </div>
                    <button 
                      onClick={() => setIsLoggedIn(false)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors py-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>ログアウト</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button className="w-full text-gray-600 hover:text-gray-900 font-medium py-3 transition-colors">
                      ログイン
                    </button>
                    <button className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg">
                      無料で始める
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
