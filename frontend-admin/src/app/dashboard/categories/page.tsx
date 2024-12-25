'use client'

import { AddCategoryButton } from '@/components/category/AddCategoryButton'
import { CategoryTable } from '@/components/category/CategoryTable'
import { useCategoryList } from '@/hooks/category/useCategoryList'
import { useCallback } from 'react'
import { ROUTES } from '@/config/routes'
import { useRouter } from 'next/navigation'

export default function CategoryList() {
  const router = useRouter()

  const { categories, isLoading, error, refetch } = useCategoryList()

  const handleCategoryEdit = (id: string) => {
    router.push(ROUTES.DASHBOARD.CATEGORIES.EDIT(id))
  }

  // 子コンポーネントへデータ再取得関数を渡す
  const handleCategoryDeleted = useCallback(async () => {
    await refetch()
  }, [refetch])

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="flex justify-between mb-4">
        <AddCategoryButton />
      </div>
      <CategoryTable
        categories={categories}
        onEdit={handleCategoryEdit}
        onDelete={handleCategoryDeleted}
        isLoading={isLoading}
      />
    </div>
  )
}
