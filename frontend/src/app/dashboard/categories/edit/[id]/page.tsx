'use client'
import { use } from 'react'

import { Card, CardBody } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useCategoryStore } from '@/stores/admin/categoryStore'
import { UpdateCategoryForm } from '@/components/category/UpdateCategoryForm'
import { ROUTES } from '@/config/routes'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default function EditCategoryPage(props: Props) {
  const params = use(props.params)
  const router = useRouter()
  const categories = useCategoryStore((state) => state.categories)

  // IDからカテゴリーを取得
  const category = categories.find((t) => t.id === params.id)

  if (!category) {
    router.push(ROUTES.DASHBOARD.CATEGORIES.BASE)
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
          redirectPath={ROUTES.DASHBOARD.CATEGORIES.BASE}
          initialData={defaultValues}
        />
      </CardBody>
    </Card>
  )
}
