import { Store } from '@/types/stores'
import { useEffect, useState } from 'react'

export function useStore(id: string) {
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchStore = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/bookstores/${id}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Store not found')
          }
          throw new Error('Failed to fetch store')
        }
        
        const data = await response.json()
        setStore(data.store)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStore()
  }, [id])

  return { store, loading, error }
}
