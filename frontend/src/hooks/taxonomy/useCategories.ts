import { useEffect, useState } from 'react'
import { taxonomyApi } from '@/lib/api'
import { useTaxonomyStore } from '@/stores/admin/taxonomyStore'

export const useCategories = () => {
  const setTaxonomies = useTaxonomyStore((state) => state.setTaxonomies)
  const taxonomies = useTaxonomyStore((state) => state.taxonomies)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const data = await taxonomyApi.getCategories()
      setTaxonomies(data) // Zustandに保存
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories().catch((error) => {
      console.error('Error fetching categories:', error)
    })
  }, [setTaxonomies])

  return { taxonomies, isLoading, error, refetch: fetchCategories }
}
