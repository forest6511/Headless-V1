'use client'

import { CreateCategoryData, createCategorySchema } from '@/schemas/category'
import { Input, Select, SelectItem, Textarea } from '@nextui-org/react'
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
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'

export const CreateCategoryForm = ({
  redirectPath,
  initialData,
  id = 'category-form',
  onSubmittingChange,
}: CreateCategoryFormProps) => {
  const router = useRouter()
  const currentLanguage = useLanguageStore((state) => state.language)
  const categories = useCategoryStore((state) => state.categories)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      ...initialData,
      language: currentLanguage,
    },
    mode: 'onChange',
  })

  const categoryOptions = formatCategoryOptionsWithoutNoSetting(
    categories,
    currentLanguage
  )

  const onSubmit = async (data: CreateCategoryData) => {
    try {
      onSubmittingChange?.(true)
      const createData: CreateCategoryRequest = {
        language: data.language,
        name: data.name,
        description: data.description || undefined,
        parentId: data.parentId || undefined,
      }
      await categoryApi.createCategory(createData)
      toast.success(t(currentLanguage, 'category.toast.createSuccess'))
      router.push(redirectPath)
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(
          `${t(currentLanguage, 'category.toast.createError')}. ${error?.details}`
        )
      } else {
        toast.error(t(currentLanguage, 'category.toast.createError'))
      }
      console.error(t(currentLanguage, 'category.toast.createError'), error)
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
          <SelectItem key={category.key}>{category.label}</SelectItem>
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
