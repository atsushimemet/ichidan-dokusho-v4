'use client'

import { useAuth } from '@/hooks/useAuth'
import { BookOpen, LogOut, Menu, User, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// 共通のメニュー設定
const navigationItems = [
  { label: 'ホーム', href: '/' },
  { label: 'みんなのメモ', href: '/memos' },
  { label: '書籍一覧', href: '/books' },
  { label: '店舗一覧', href: '/bookstores' },
]

const adminItems = [
  { label: '管理者ログイン', href: '/admin/login' },
]

export default function Navigation() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isLoading, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2663eb' }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">一段読書</span>
              <p className="text-xs text-gray-500 -mt-1">Knowledge Loop Edition</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              </Link>
            ))}
            
            {isLoading ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user.email}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>ログアウト</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  ログイン
                </Link>
                <Link href="/login" className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                  無料で始める
                </Link>
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
              {navigationItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="text-gray-600 hover:text-primary-600 font-medium py-2 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-2 border-t border-gray-100">
                {adminItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className="text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"></div>
                  </div>
                ) : user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-600 py-2">
                      <User className="w-5 h-5" />
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors py-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>ログアウト</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/login" className="block w-full text-gray-600 hover:text-gray-900 font-medium py-3 transition-colors text-center">
                      ログイン
                    </Link>
                    <Link href="/login" className="block w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg text-center">
                      無料で始める
                    </Link>
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
