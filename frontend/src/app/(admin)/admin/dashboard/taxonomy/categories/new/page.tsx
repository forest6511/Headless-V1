'use client'

import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react'
import { useTaxonomyStore } from '@/stores/admin/taxonomyStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CategoryFormData, taxonomySchema } from '@/schemas/taxonomy'
import { taxonomyApi } from '@/lib/api/taxonomy'
import { useRouter } from 'next/navigation'

export default function CategoryForm() {
  const router = useRouter()
  // Zustandから取得
  const taxonomies = useTaxonomyStore((state) => state.taxonomies)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(taxonomySchema),
    defaultValues: {
      type: 'CATEGORY' as const,
    },
    mode: 'onChange',
  })

  const taxonomyOptions = taxonomies.map((taxonomy) => ({
    key: taxonomy.id,
    label: taxonomy.name,
  }))

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await taxonomyApi.createCategory(data)
      router.push('/admin/dashboard/taxonomy/categories')
    } catch (error) {
      console.error('カテゴリーの作成に失敗しました:', error)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardBody>
        <h1 className="text-2xl font-bold mb-6">カテゴリーの新規作成</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            {...register('name')}
            label="名前"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
          />

          <Input
            {...register('slug')}
            label="スラッグ"
            isInvalid={!!errors.slug}
            errorMessage={errors.slug?.message}
          />

          <Select
            {...register('parentId')}
            items={taxonomyOptions}
            label="親カテゴリー"
            placeholder="カテゴリーを選択してください"
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0]?.toString()
              register('parentId').onChange({ target: { value: selectedKey } })
            }}
            isInvalid={!!errors.parentId}
            errorMessage={errors.parentId?.message}
          >
            {(taxonomy) => (
              <SelectItem key={taxonomy.key}>{taxonomy.label}</SelectItem>
            )}
          </Select>

          <Textarea
            {...register('description')}
            label="説明"
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message}
          />

          <Button type="submit" color="primary">
            新規カテゴリーを追加
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
