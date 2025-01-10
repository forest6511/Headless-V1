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
  id = 'category-form',
  onSubmittingChange,
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

  const categoryOptions = formatCategoryOptionsWithoutNoSetting(
    categories,
    'ja'
  )

  const onSubmit = async (data: CreateCategoryData) => {
    try {
      onSubmittingChange?.(true) // 送信開始時にtrueをセット
      const createData: CreateCategoryRequest = {
        language: 'ja',
        name: data.name,
        description: data.description || undefined,
        parentId: data.parentId || undefined,
      }
      await categoryApi.createCategory(createData)
      toast.success('カテゴリーを作成しました')
      router.push(redirectPath)
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`カテゴリーの作成に失敗しました。 ${error?.details}`)
      } else {
        toast.error('カテゴリーの作成に失敗しました')
      }
      console.error('カテゴリーの作成に失敗しました:', error)
    } finally {
      onSubmittingChange?.(false) // 完了時にfalseをセット
    }
  }

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        {...register('name')}
        label="名前"
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
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
    </form>
  )
}
