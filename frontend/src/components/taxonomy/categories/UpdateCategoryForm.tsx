'use client'

import {
  UpdateTaxonomyFormData,
  updateTaxonomySchema,
} from '@/schemas/taxonomy'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { useTaxonomyStore } from '@/stores/admin/taxonomyStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { taxonomyApi } from '@/lib/api'
import { UpdateTaxonomyRequest } from '@/types/api/taxonomy/request'
import {
  formatTaxonomyOptions,
  UpdateCategoryFormProps,
} from '@/types/api/taxonomy/types'
import { ApiError } from '@/lib/api/core/client'
import toast from 'react-hot-toast'

export const UpdateCategoryForm = ({
  redirectPath,
  initialData,
}: UpdateCategoryFormProps) => {
  const router = useRouter()
  const taxonomies = useTaxonomyStore((state) => state.taxonomies)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTaxonomyFormData>({
    resolver: zodResolver(updateTaxonomySchema),
    defaultValues: initialData,
    mode: 'onChange',
  })

  const taxonomyOptions = formatTaxonomyOptions(taxonomies)

  const onSubmit = async (data: UpdateTaxonomyFormData) => {
    try {
      const requestData: UpdateTaxonomyRequest = {
        id: data.id,
        name: data.name,
        type: data.type,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || undefined,
      }
      await taxonomyApi.updateCategory(requestData)
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
        items={taxonomyOptions}
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
        カテゴリーを更新
      </Button>
    </form>
  )
}
