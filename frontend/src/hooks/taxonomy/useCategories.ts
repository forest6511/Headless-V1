import { useEffect, useState } from 'react'
import { taxonomyApi } from '@/lib/api'
import { useTaxonomyStore } from '@/stores/admin/taxonomyStore'

export const useCategories = () => {
  const setTaxonomies = useTaxonomyStore((state) => state.setTaxonomies)
  const taxonomies = useTaxonomyStore((state) => state.taxonomies)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await taxonomyApi.getCategories()
        setTaxonomies(data) // Zustandに保存
      } catch (error) {
        setError(error as Error)
      } finally {
        setIsLoading(false)
      }
    }

    // 即時実行関数でラップして非同期処理を安全に呼び出す
    ;(async () => {
      await fetchCategories()
    })()
  }, [setTaxonomies])

  return { taxonomies, isLoading, error }
}
