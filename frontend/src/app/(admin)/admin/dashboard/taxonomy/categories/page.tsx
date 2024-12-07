'use client'

import { AddCategoryButton } from '@/components/taxonomy/categories/AddCategoryButton'
import { TaxonomyTable } from '@/components/taxonomy/categories/TaxonomyTable'
import { useCategories } from '@/hooks/taxonomy/useCategories'
import { Selection } from '@nextui-org/react'
import { useState } from 'react'

export default function CategoryList() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set<string>() as Selection
  )
  const { taxonomies, isLoading, error } = useCategories()

  const handleEdit = (id: string) => {
    console.log('編集:', id)
  }

  const handleDelete = (id: string) => {
    console.log('削除:', id)
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
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
