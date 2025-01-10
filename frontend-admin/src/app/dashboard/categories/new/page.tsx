'use client'
import { useState } from 'react'
import { Button, Card, CardBody } from '@nextui-org/react'
import { CreateCategoryForm } from '@/components/category/CreateCategoryForm'
import { ROUTES } from '@/config/routes'
import { Save } from 'lucide-react'
import { Loading } from '@/components/ui/loading'

export default function NewCategoryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <>
      <Loading isLoading={isSubmitting} />
      <Card className="w-full">
        <CardBody>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                form="category-form"
                color="primary"
                size="md"
                startContent={<Save size={20} />}
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              >
                新規カテゴリーを追加
              </Button>
              <span>日本語で入力してください</span>
            </div>
          </div>
          <CreateCategoryForm
            id="category-form"
            redirectPath={ROUTES.DASHBOARD.CATEGORIES.BASE}
            initialData={{
              name: '',
              description: '',
            }}
            onSubmittingChange={setIsSubmitting}
          />
        </CardBody>
      </Card>
    </>
  )
}
