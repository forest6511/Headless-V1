'use client'

import {
  UpdateCategoryData,
  createUpdateCategorySchema,
} from '@/schemas/category'
import { Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { useCategoryStore } from '@/stores/admin/categoryStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { categoryApi } from '@/lib/api'
import { UpdateCategoryRequest } from '@/types/api/category/request'
import { ApiError } from '@/lib/api/core/client'
import toast from 'react-hot-toast'
import { createCategoryOptions } from '@/lib/utils/category'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'

interface UpdateCategoryFormProps {
  redirectPath: string
  initialData: UpdateCategoryData
  id?: string
  onSubmittingChange?: (isSubmitting: boolean) => void
}

export const UpdateCategoryForm = ({
  redirectPath,
  initialData,
  id = 'category-form',
  onSubmittingChange,
}: UpdateCategoryFormProps) => {
  const router = useRouter()
  const currentLanguage = useLanguageStore((state) => state.language)
  const categories = useCategoryStore((state) => state.categories)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCategoryData>({
    resolver: zodResolver(createUpdateCategorySchema(currentLanguage)),
    defaultValues: initialData,
    mode: 'onChange',
  })

  const categoryOptions = createCategoryOptions(
    categories,
    initialData?.language || currentLanguage
  )

  const onSubmit = async (data: UpdateCategoryData) => {
    try {
      onSubmittingChange?.(true)
      const requestData: UpdateCategoryRequest = {
        id: data.id,
        language: data.language,
        name: data.name,
        description: data.description,
        parentId: data.parentId || undefined,
      }
      await categoryApi.updateCategory(requestData)
      router.push(redirectPath)
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(
          `${t(currentLanguage, 'category.toast.updateError')}. ${error?.details}`
        )
      }
      console.error(t(currentLanguage, 'category.toast.updateError'), error)
    } finally {
      onSubmittingChange?.(false)
    }
  }

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        {...register('name')}
        label={t(currentLanguage, 'category.form.name')}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
      />
      <Select
        {...register('parentId')}
        items={categoryOptions}
        label={t(currentLanguage, 'category.form.parentCategory')}
        placeholder={t(
          currentLanguage,
          'category.form.parentCategoryPlaceholder'
        )}
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
          <SelectItem key={category.value}>{category.label}</SelectItem>
        )}
      </Select>

      <Textarea
        {...register('description')}
        label={t(currentLanguage, 'category.form.description')}
        isInvalid={!!errors.description}
        errorMessage={errors.description?.message}
      />
    </form>
  )
}
