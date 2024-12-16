'use client'

import { UpdateCategoryData, updateCategorySchema } from '@/schemas/category'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { useCategoryStore } from '@/stores/admin/categoryStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { categoryApi } from '@/lib/api'
import { UpdateCategoryRequest } from '@/types/api/category/request'
import {
  formatCategoryOptions,
  UpdateCategoryFormProps,
} from '@/types/api/category/types'
import { ApiError } from '@/lib/api/core/client'
import toast from 'react-hot-toast'

export const UpdateCategoryForm = ({
  redirectPath,
  initialData,
}: UpdateCategoryFormProps) => {
  const router = useRouter()
  const categories = useCategoryStore((state) => state.categories)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCategoryData>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: initialData,
    mode: 'onChange',
  })

  const categoryOptions = formatCategoryOptions(categories)

  const onSubmit = async (data: UpdateCategoryData) => {
    try {
      const requestData: UpdateCategoryRequest = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || undefined,
      }
      await categoryApi.updateCategory(requestData)
      router.push(redirectPath)
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`カテゴリーの更新に失敗しました。 ${error?.details}`)
      }
      console.error('カテゴリーの更新に失敗しました:', error)
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
        カテゴリーを更新
      </Button>
    </form>
  )
}
