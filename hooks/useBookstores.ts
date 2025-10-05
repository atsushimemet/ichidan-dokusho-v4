import { Bookstore } from '@/types/database'
import { useEffect, useState } from 'react'

export function useBookstores(limit?: number) {
  const [bookstores, setBookstores] = useState<Bookstore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookstores = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (limit) {
          params.append('limit', limit.toString())
        }
        
        const response = await fetch(`/api/bookstores?${params}`)
        if (!response.ok) {
          throw new Error('Failed to fetch bookstores')
        }
        
        const data = await response.json()
        setBookstores(data.bookstores)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchBookstores()
  }, [limit])

  return { bookstores, loading, error }
}
