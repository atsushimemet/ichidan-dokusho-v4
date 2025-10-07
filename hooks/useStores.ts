import { Store } from '@/types/stores'
import { useEffect, useState } from 'react'

export function useStores(limit?: number) {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (limit) {
          params.append('limit', limit.toString())
        }
        
        const response = await fetch(`/api/bookstores?${params}`)
        if (!response.ok) {
          throw new Error('Failed to fetch stores')
        }
        
        const data = await response.json()
        setStores(data.stores)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [limit])

  return { stores, loading, error }
}

