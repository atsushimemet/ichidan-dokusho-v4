import { Memo } from '@/types/database'
import { useEffect, useState } from 'react'

export function useMemos(limit?: number) {
  const [memos, setMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMemos = async () => {
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchMemos()
  }, [limit])

  return { memos, loading, error }
}
