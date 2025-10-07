import { CategoryTag } from '@/types/stores'
import { useEffect, useState } from 'react'

export function useCategoryTags() {
  const [categoryTags, setCategoryTags] = useState<CategoryTag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategoryTags = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/category-tags')
        if (!response.ok) {
          throw new Error('Failed to fetch category tags')
        }
        
        const data = await response.json()
        setCategoryTags(data.categoryTags)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryTags()
  }, [])

  return { categoryTags, loading, error }
}

