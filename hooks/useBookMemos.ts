import { Memo } from '@/types/database'
import { useCallback, useEffect, useState } from 'react'

interface UseBookMemosResult {
  memos: Memo[]
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useBookMemos(bookId: string | null, limit = 3): UseBookMemosResult {
  const [memos, setMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const refresh = useCallback(() => {
    setReloadToken((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!bookId) {
      setMemos([])
      return
    }

    const controller = new AbortController()

    const fetchMemos = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        params.append('book_id', bookId)
        params.append('limit', limit.toString())

        const response = await fetch(`/api/memos?${params.toString()}`, {
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error('Failed to fetch memos')
        }

        const data = await response.json()
        setMemos(data.memos ?? [])
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return
        }
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchMemos()

    return () => {
      controller.abort()
    }
  }, [bookId, limit, reloadToken])

  return {
    memos,
    loading,
    error,
    refresh
  }
}
