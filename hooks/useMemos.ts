import { Memo } from '@/types/database'
import { useEffect, useState } from 'react'
import { useClerkAuth } from '@/hooks/useClerkAuth'

export function useMemos(limit?: number) {
  const { isAuthenticated, isLoading: authLoading } = useClerkAuth()
  const [memos, setMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0)

  useEffect(() => {
    const fetchMemos = async () => {
      // 認証状態のローディング中は何もしない
      if (authLoading) {
        return
      }
      
      // 未認証の場合は空の配列を設定
      if (!isAuthenticated) {
        setMemos([])
        setTotalCount(0)
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (limit) {
          params.append('limit', limit.toString())
        }
        
        const response = await fetch(`/api/memos?${params}`)
        if (!response.ok) {
          throw new Error('Failed to fetch memos')
        }
        
        const data = await response.json()
        setMemos(data.memos)
        setTotalCount(typeof data.count === 'number' ? data.count : 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchMemos()
  }, [limit, isAuthenticated, authLoading])

  return { memos, loading, error, totalCount }
}
