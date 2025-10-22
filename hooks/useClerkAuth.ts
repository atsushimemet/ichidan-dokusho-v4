'use client'

import { useUser, useAuth as useClerkAuthHook } from '@clerk/nextjs'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ichidan_user'

export function useClerkAuth() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()
  const { signOut: clerkSignOut } = useClerkAuthHook()
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Clerk認証がある場合、Supabaseユーザーも同期
    const syncUsers = async () => {
      if (clerkUser && clerkLoaded) {
        try {
          // Clerkユーザー情報をSupabaseに同期
          const { data: { user }, error } = await supabase.auth.getUser()
          
          if (error || !user) {
            // Supabaseユーザーが存在しない場合、Clerk情報でSupabaseユーザーを作成
            // この部分は実際の実装では適切な同期ロジックが必要
            console.log('Syncing Clerk user with Supabase:', clerkUser)
          } else {
            setSupabaseUser(user)
          }
        } catch (error) {
          console.error('Error syncing users:', error)
        }
      } else if (!clerkUser && clerkLoaded) {
        setSupabaseUser(null)
      }
      
      setIsLoading(false)
    }

    syncUsers()
  }, [clerkUser, clerkLoaded])

  const signOut = async () => {
    try {
      // Clerkからサインアウト
      await clerkSignOut()
      
      // Supabaseからもサインアウト
      const supabase = createClient()
      await supabase.auth.signOut()
      
      // localStorageをクリア
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
      }
      
      setSupabaseUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const clearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    setSupabaseUser(null)
  }

  return {
    user: clerkUser || supabaseUser,
    isLoading: !clerkLoaded || isLoading,
    signOut,
    clearStorage,
    isAuthenticated: !!(clerkUser || supabaseUser),
    clerkUser,
    supabaseUser
  }
}
