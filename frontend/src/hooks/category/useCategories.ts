import { useEffect, useState } from 'react'
import { categoryApi } from '@/lib/api'
import { useCategoryStore } from '@/stores/admin/categoryStore'

export const useCategories = () => {
  const setCategories = useCategoryStore((state) => state.setCategories)
  const categories = useCategoryStore((state) => state.categories)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const data = await categoryApi.getCategories()
      setCategories(data) // Zustandに保存
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
  }, [setCategories])

  return { categories, isLoading, error, refetch: fetchCategories }
}
