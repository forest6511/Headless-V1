'use client'

import {
  CreateTaxonomyFormData,
  createTaxonomySchema,
} from '@/schemas/taxonomy'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { useTaxonomyStore } from '@/stores/admin/taxonomyStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { taxonomyApi } from '@/lib/api'
import { CreateTaxonomyRequest } from '@/types/api/taxonomy/request'
import {
  CreateCategoryFormProps,
  formatTaxonomyOptionsWithoutNoSetting,
} from '@/types/api/taxonomy/types'
import { ApiError } from '@/lib/api/core/client'
import toast from 'react-hot-toast'

export const CreateCategoryForm = ({
  redirectPath,
  initialData,
}: CreateCategoryFormProps) => {
  const router = useRouter()
  const taxonomies = useTaxonomyStore((state) => state.taxonomies)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaxonomyFormData>({
    resolver: zodResolver(createTaxonomySchema),
    defaultValues: {
      ...initialData,
      type: 'CATEGORY' as const,
    },
    mode: 'onChange',
  })

  const taxonomyOptions = formatTaxonomyOptionsWithoutNoSetting(taxonomies)

  const onSubmit = async (data: CreateTaxonomyFormData) => {
    try {
      const createData: CreateTaxonomyRequest = {
        name: data.name,
        type: data.type,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || undefined,
      }
      await taxonomyApi.createCategory(createData)
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
        新規カテゴリーを追加
      </Button>
    </form>
  )
}
