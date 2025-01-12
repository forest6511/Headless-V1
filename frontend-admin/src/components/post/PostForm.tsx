import {
  PostFormData,
  createPostSchema,
  createUpdatePostSchema,
} from '@/schemas/post'
import { usePostForm } from '@/hooks/post/usePostForm'
import { Card, CardBody, Input, Select, SelectItem } from '@nextui-org/react'
import { PostStatuses } from '@/types/api/post/types'
import TiptapEditor from '@/components/tiptap/TiptapEditor'
import React, { useEffect } from 'react'
import { useCategoryList } from '@/hooks/category/useCategoryList'
import { createCategoryOptions } from '@/lib/utils/category'
import pretty from 'pretty'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'

interface PostFormProps {
  redirectPath: string
  initialData?: PostFormData
  mode: 'create' | 'update'
  id: string
  onSubmittingChange: (isSubmitting: boolean) => void
}

export function PostForm({
  redirectPath,
  initialData,
  mode,
  id = 'post-form',
  onSubmittingChange,
}: PostFormProps) {
  const currentLanguage = useLanguageStore((state) => state.language)
  const { categories } = useCategoryList()
  const categoryOptions = createCategoryOptions(
    categories,
    initialData?.language || currentLanguage
  )

  const {
    form,
    textLength,
    contentHtml,
    onSubmit,
    handleEditorChange,
    isSubmitting,
  } = usePostForm({
    redirectPath,
    initialData,
    mode,
    currentLanguage,
    schema:
      mode === 'create'
        ? createPostSchema(currentLanguage)
        : createUpdatePostSchema(currentLanguage),
  })

  const {
    register,
    formState: { errors },
    watch,
  } = form

  // isSubmittingの状態が変更されたら親コンポーネントに通知
  useEffect(() => {
    onSubmittingChange?.(isSubmitting)
  }, [isSubmitting, onSubmittingChange])

  return (
    <form onSubmit={onSubmit} className="flex flex-row-reverse gap-6" id={id}>
      <div className="w-1/3 space-y-6">
        <Card>
          <CardBody className="space-y-4">
            <Input
              {...register('title')}
              label={t(currentLanguage, 'post.form.title')}
              placeholder={t(currentLanguage, 'post.form.placeholders.title')}
              isInvalid={!!errors.title}
              errorMessage={errors?.title?.message}
            />
            <Input
              {...register('tagNames')}
              label={t(currentLanguage, 'post.form.hashtag')}
              placeholder={t(currentLanguage, 'post.form.placeholders.hashtag')}
              isInvalid={!!errors.tagNames}
              errorMessage={errors?.tagNames?.message}
            />
            <Select
              {...register('categoryId')}
              label={t(currentLanguage, 'post.form.category')}
              isInvalid={!!errors.categoryId}
              errorMessage={errors?.categoryId?.message}
            >
              {categoryOptions.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              {...register('status')}
              label={t(currentLanguage, 'post.form.status')}
              isInvalid={!!errors.status}
              errorMessage={errors?.status?.message}
            >
              {PostStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.labels[currentLanguage]}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
        </Card>
      </div>
      <div className="w-2/3 space-y-6">
        <Card>
          <CardBody className="space-y-4">
            <div className="h-[800px] overflow-y-auto">
              {/* zod validationが効かないので、hidden項目に設定 */}
              <input type="hidden" {...register('content')} />
              <TiptapEditor
                value={watch('content')}
                onChange={handleEditorChange}
              />
              {errors?.content?.message && (
                <p className="text-xs text-danger mt-2">
                  {errors.content.message}
                </p>
              )}
            </div>
            {/* HTMLプレビュー */}
            <div className="mt-4 border-t pt-4">
              <h3 className="text-md font-semibold mb-2">
                {t(currentLanguage, 'post.preview')} {textLength}
              </h3>
              <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
                {pretty(contentHtml || '')}
              </pre>
            </div>
          </CardBody>
        </Card>
      </div>
    </form>
  )
}
