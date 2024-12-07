'use client'

import { CategoryFormData, taxonomySchema } from '@/schemas/taxonomy'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { useTaxonomyStore } from '@/stores/admin/taxonomyStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { taxonomyApi } from '@/lib/api/taxonomy'
import { TaxonomyCategoryRequest } from '@/types/api/taxonomy/request'

export type CategoryFormMode = 'new' | 'edit' | 'delete' | 'view'

interface CategoryFormProps {
  mode: CategoryFormMode
  redirectPath: string
  initialData?: CategoryFormData
}

export const CategoryForm = ({
  redirectPath,
  initialData,
}: CategoryFormProps) => {
  const router = useRouter()
  const taxonomies = useTaxonomyStore((state) => state.taxonomies)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(taxonomySchema),
    defaultValues: initialData || {
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
      const taxonomyCategoryRequest = data as TaxonomyCategoryRequest
      await taxonomyApi.createCategory(taxonomyCategoryRequest)
      router.push(redirectPath)
    } catch (error) {
      console.error('カテゴリーの作成に失敗しました:', error)
    }
  }

  return (
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
        {initialData ? 'カテゴリーを更新' : '新規カテゴリーを追加'}
      </Button>
    </form>
  )
}
