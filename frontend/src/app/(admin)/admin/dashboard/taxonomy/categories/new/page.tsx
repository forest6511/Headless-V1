'use client'

import { Card, CardBody } from '@nextui-org/react'
import { CategoryForm } from '@/components/taxonomy/categories/CategoryForm'

export default function NewCategoryPage() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardBody>
        <h1 className="text-2xl font-bold mb-6">カテゴリーの新規作成</h1>
        <CategoryForm
          mode={'new'}
          redirectPath="/admin/dashboard/taxonomy/categories"
        />
      </CardBody>
    </Card>
  )
}
