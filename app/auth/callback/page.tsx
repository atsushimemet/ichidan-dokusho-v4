'use client'

import { createClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient()
        const redirectTo = searchParams.get('redirectTo') || '/'

        console.log('Auth callback - redirectTo:', redirectTo)

        // 認証状態の変化を監視
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session?.user?.email)
            
            if (event === 'SIGNED_IN' && session) {
              console.log('認証成功、リダイレクト中:', redirectTo)
              router.push(redirectTo)
            } else if (event === 'SIGNED_OUT') {
              setError('認証に失敗しました。')
              setTimeout(() => {
                router.push('/login?error=auth_failed')
              }, 3000)
            }
          }
        )

        // 現在のセッションを確認
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError(`セッションエラー: ${sessionError.message}`)
          setTimeout(() => {
            router.push('/login?error=session_error')
          }, 3000)
        } else if (session) {
          console.log('既存セッション確認、リダイレクト中:', redirectTo)
          router.push(redirectTo)
        }

        // クリーンアップ
        return () => {
          subscription.unsubscribe()
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setError('認証処理中にエラーが発生しました。')
        setTimeout(() => {
          router.push('/login?error=callback_error')
        }, 3000)
      } finally {
        setIsLoading(false)
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">認証中...</h2>
          <p className="text-gray-600">ログイン処理を行っています</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">認証エラー</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">自動的にログインページにリダイレクトされます...</p>
        </div>
      </div>
    )
  }

  return null
}
