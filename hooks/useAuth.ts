'use client'

import { createClient } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ichidan_user'

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // localStorageからユーザー情報を復元
    const restoreUserFromStorage = () => {
      try {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem(STORAGE_KEY)
          if (storedUser) {
            const userData = JSON.parse(storedUser)
            setUser(userData)
            setIsLoading(false)
            return true // 復元成功
          }
        }
      } catch (error) {
        console.error('Error restoring user from localStorage:', error)
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
      return false // 復元失敗
    }

    // 現在のユーザーを取得
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          // localStorageにユーザー情報を保存
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
          }
        } else {
          // ユーザーがいない場合はlocalStorageをクリア
          if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY)
          }
          setUser(null)
        }
      } catch (error) {
        console.error('Error getting user:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    // まずlocalStorageから復元を試行
    const restored = restoreUserFromStorage()
    
    // localStorageから復元できなかった場合、または復元できても最新の状態を確認
    if (!restored) {
      getUser()
    } else {
      // 復元できた場合でも、バックグラウンドで最新の状態を確認
      getUser()
    }

    // 認証状態の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        // localStorageにユーザー情報を保存
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(session.user))
        }
      } else {
        setUser(null)
        // localStorageをクリア
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    // localStorageをクリア
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    setUser(null)
  }

  const clearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    setUser(null)
  }

  return {
    user,
    isLoading,
    signOut,
    clearStorage,
    isAuthenticated: !!user
  }
}

