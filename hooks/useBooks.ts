import { Book } from '@/types/database'
import { useEffect, useState } from 'react'

export function useBooks(limit?: number) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (limit) {
          params.append('limit', limit.toString())
        }
        
        const response = await fetch(`/api/books?${params}`)
        if (!response.ok) {
          throw new Error('Failed to fetch books')
        }
        
        const data = await response.json()
        setBooks(data.books)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [limit])

  return { books, loading, error }
}
