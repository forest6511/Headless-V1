'use client'

import { Card, CardBody } from '@nextui-org/react'
import {CreateCategoryForm} from "@/components/taxonomy/categories/CreateCategoryForm";

export default function NewCategoryPage() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardBody>
        <h1 className="text-2xl font-bold mb-6">カテゴリーの新規作成</h1>
        <CreateCategoryForm
          redirectPath="/admin/dashboard/taxonomy/categories"
        />
      </CardBody>
    </Card>
  )
}
