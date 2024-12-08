'use client'

import {
  CreateTaxonomyFormData,
  UpdateTaxonomyFormData,
  createTaxonomySchema,
  updateTaxonomySchema,
} from '@/schemas/taxonomy'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { useTaxonomyStore } from '@/stores/admin/taxonomyStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { taxonomyApi } from '@/lib/api/taxonomy'
import {
  CreateTaxonomyRequest,
  UpdateTaxonomyRequest,
} from '@/types/api/taxonomy/request'

export type CategoryFormMode = 'new' | 'edit'

interface CategoryFormProps {
  mode: CategoryFormMode
  redirectPath: string
  initialData?: CreateTaxonomyFormData | UpdateTaxonomyFormData
}

export const CategoryForm = ({
  mode,
  redirectPath,
  initialData,
}: CategoryFormProps) => {
  const router = useRouter()
  const taxonomies = useTaxonomyStore((state) => state.taxonomies)

  // 編集モードの場合、defaultValuesに呼び出し元のIDを設定
  const defaultValues =
    mode === 'edit' && initialData
      ? { ...initialData }
      : { type: 'CATEGORY' as const }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaxonomyFormData | UpdateTaxonomyFormData>({
    resolver: zodResolver(
      mode === 'edit' ? updateTaxonomySchema : createTaxonomySchema
    ),
    defaultValues,
    mode: 'onChange',
  })

  const taxonomyOptions = taxonomies.map((taxonomy) => ({
    key: taxonomy.id,
    label: taxonomy.name,
  }))

  const handleCreate = async (data: CreateTaxonomyFormData) => {
    const createData: CreateTaxonomyRequest = {
      name: data.name,
      type: data.type,
      slug: data.slug,
      description: data.description,
      parentId: data.parentId || undefined,
    }
    await taxonomyApi.createCategory(createData)
  }

  const handleUpdate = async (data: UpdateTaxonomyFormData) => {
    const requestData: UpdateTaxonomyRequest = {
      id: data.id,
      name: data.name,
      type: data.type,
      slug: data.slug,
      description: data.description,
      parentId: data.parentId || undefined,
    }
    await taxonomyApi.updateCategory(requestData)
  }

  const onSubmit = async (
    data: CreateTaxonomyFormData | UpdateTaxonomyFormData
  ) => {
    try {
      switch (mode) {
        case 'new':
          await handleCreate(data as CreateTaxonomyFormData)
          break
        case 'edit':
          await handleUpdate(data as UpdateTaxonomyFormData)
          break
      }
      router.push(redirectPath)
    } catch (error) {
      console.error('カテゴリーの操作に失敗しました:', error)
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
        {mode === 'edit' ? 'カテゴリーを更新' : '新規カテゴリーを追加'}
      </Button>
    </form>
  )
}
