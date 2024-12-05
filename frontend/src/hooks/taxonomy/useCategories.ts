import { TaxonomyWithPostRefsResponse } from '@/types/api/taxonomy/response'
import { useEffect, useState } from 'react'
import { taxonomyApi } from '@/lib/api/taxonomy'

export const useCategories = () => {
  const [taxonomies, setTaxonomies] = useState<TaxonomyWithPostRefsResponse[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await taxonomyApi.getCategories()
        setTaxonomies(data)
      } catch (error) {
        setError(error as Error)
        console.error('カテゴリーの取得に失敗しました:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { taxonomies, isLoading, error }
}
