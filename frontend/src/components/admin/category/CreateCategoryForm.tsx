'use client'

import { CreateCategoryData, createCategorySchema } from '@/schemas/category'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { useCategoryStore } from '@/stores/admin/categoryStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { categoryApi } from '@/lib/api'
import { CreateCategoryRequest } from '@/types/api/category/request'
import {
  CreateCategoryFormProps,
  formatCategoryOptionsWithoutNoSetting,
} from '@/types/api/category/types'
import { ApiError } from '@/lib/api/core/client'
import toast from 'react-hot-toast'

export const CreateCategoryForm = ({
  redirectPath,
  initialData,
}: CreateCategoryFormProps) => {
  const router = useRouter()
  const categories = useCategoryStore((state) => state.categories)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      ...initialData,
    },
    mode: 'onChange',
  })

  const categoryOptions = formatCategoryOptionsWithoutNoSetting(categories)

  const onSubmit = async (data: CreateCategoryData) => {
    try {
      const createData: CreateCategoryRequest = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || undefined,
      }
      await categoryApi.createCategory(createData)
      router.push(redirectPath)
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`カテゴリーの更新に失敗しました。 ${error?.details}`)
      }
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
        items={categoryOptions}
        label="親カテゴリー"
        placeholder="カテゴリーを選択してください"
        onSelectionChange={async (keys) => {
          const selectedKey = Array.from(keys)[0]?.toString()
          await register('parentId').onChange({
            target: { value: selectedKey },
          })
        }}
        isInvalid={!!errors.parentId}
        errorMessage={errors.parentId?.message}
      >
        {(category) => (
          <SelectItem key={category.key}>{category.label}</SelectItem>
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
  )
}
