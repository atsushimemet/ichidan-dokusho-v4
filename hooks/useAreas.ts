import { Area } from '@/types/stores'
import { useEffect, useState } from 'react'

export function useAreas() {
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/areas')
        if (!response.ok) {
          throw new Error('Failed to fetch areas')
        }
        
        const data = await response.json()
        setAreas(data.areas)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAreas()
  }, [])

  return { areas, loading, error }
}

