'use client'

import { AddCategoryButton } from '@/components/taxonomy/categories/AddCategoryButton'
import { TaxonomyTable } from '@/components/taxonomy/categories/TaxonomyTable'
import { useCategories } from '@/hooks/taxonomy/useCategories'

export default function CategoryList() {
  const { taxonomies, isLoading, error, refetch } = useCategories() // refetchを追加

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
      <TaxonomyTable
        taxonomies={taxonomies}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
