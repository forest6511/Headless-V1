'use client'

import { Card, CardBody } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useCategoryStore } from '@/stores/admin/categoryStore'
import { UpdateCategoryForm } from '@/components/admin/category/UpdateCategoryForm'

interface Props {
  params: {
    id: string
  }
}

export default function EditCategoryPage({ params }: Props) {
  const router = useRouter()
  const categories = useCategoryStore((state) => state.categories)

  // IDからカテゴリーを取得
  const category = categories.find((t) => t.id === params.id)

  if (!category) {
    router.push('/admin/dashboard/categories')
    return null
  }

  const defaultValues = {
    id: params.id,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    parentId: category.parentId || '',
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardBody>
        <h1 className="text-2xl font-bold mb-6">カテゴリーの編集</h1>
        <UpdateCategoryForm
          redirectPath="/admin/dashboard/categories"
          initialData={defaultValues}
        />
      </CardBody>
    </Card>
  )
}
