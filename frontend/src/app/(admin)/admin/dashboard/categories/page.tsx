'use client'

import { AddCategoryButton } from '@/components/admin/category/AddCategoryButton'
import { CategoryTable } from '@/components/admin/category/CategoryTable'
import { useCategories } from '@/hooks/category/useCategories'

export default function CategoryList() {
  const { categories, isLoading, error, refetch } = useCategories()

  // 子コンポーネントへデータ再取得関数を渡す
  const handleDelete = async () => {
    await refetch()
  }

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
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
