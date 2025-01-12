'use client'

import { AddCategoryButton } from '@/components/category/AddCategoryButton'
import { CategoryTable } from '@/components/category/CategoryTable'
import { useCategoryList } from '@/hooks/category/useCategoryList'
import { useCallback, useEffect } from 'react'
import { ROUTES } from '@/config/routes'
import { useRouter } from 'next/navigation'
import { useLanguageStore } from '@/stores/admin/languageStore'

export default function CategoryList() {
  const router = useRouter()
  const currentLanguage = useLanguageStore((state) => state.language)
  const { categories, isLoading, refetch } = useCategoryList()

  useEffect(() => {
    refetch()
  }, [currentLanguage, refetch])

  const handleCategoryEdit = (id: string) => {
    router.push(ROUTES.DASHBOARD.CATEGORIES.EDIT(id))
  }

  // 子コンポーネントへデータ再取得関数を渡す
  const handleCategoryDeleted = useCallback(async () => {
    await refetch()
  }, [refetch])

  return (
    <div className="container mx-auto p-2 space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <AddCategoryButton />
      </div>
      <CategoryTable
        categories={categories}
        onEdit={handleCategoryEdit}
        onDelete={handleCategoryDeleted}
        isLoading={isLoading}
        currentLanguage={currentLanguage}
      />
    </div>
  )
}
