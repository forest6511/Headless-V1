import { useEffect, useState, useCallback } from 'react'
import { categoryApi } from '@/lib/api'
import { useCategoryStore } from '@/stores/admin/categoryStore'
import { CategoryListResponse } from '@/types/api/category/response'


export const useCategoryList = () => {
  const setCategories = useCategoryStore((state) => state.setCategories)
  const categories = useCategoryStore((state) => state.categories)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCategoryList = useCallback(async () => {
    try {
      setIsLoading(true)
      const data: CategoryListResponse[] = await categoryApi.getCategories()
      setCategories(data) // Zustandに保存
    } catch (error) {
      setError(error as Error)
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }, [setCategories])

  useEffect(() => {
    fetchCategoryList().catch((error) => {
      console.error('Error during initial fetch:', error)
    })
  }, [fetchCategoryList])

  return { categories, isLoading, error, refetch: fetchCategoryList }
}
