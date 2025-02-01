import {
  PostFormData,
  createPostSchema,
  createUpdatePostSchema,
} from '@/schemas/post'
import { usePostForm } from '@/hooks/post/usePostForm'
import {
  Card,
  CardBody,
  Input,
  Select,
  Button,
  SelectItem,
  Textarea,
} from '@nextui-org/react'
import { PostStatuses } from '@/types/api/post/types'
import TiptapEditor from '@/components/tiptap/TiptapEditor'
import React, { useEffect, useState } from 'react'
import { useCategoryList } from '@/hooks/category/useCategoryList'
import { createCategoryOptions } from '@/lib/utils/category'
import pretty from 'pretty'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'
import { MediaSelectModal } from '@/components/tiptap/MediaSelectModal'
import { MediaFile } from '@/types/api/media/types'

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

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState('')
  const handleMediaSelect = (file: MediaFile) => {
    form.setValue('featuredImageId', file.id, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
    setSelectedImageUrl(file.mediumUrl)
    form.setValue('featuredImageUrl', file.mediumUrl)
    setIsMediaModalOpen(false)
  }

  useEffect(() => {
    if (initialData?.featuredImageUrl) {
      setSelectedImageUrl(initialData.featuredImageUrl)
    } else {
      setSelectedImageUrl('') // 初期値がない場合のリセット
    }
  }, [initialData])

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
            {/* メイン画像選択 */}
            <div className="space-y-2">
              <input type="hidden" {...register('featuredImageId')} />
              <div>
                <div className="mb-2">
                  <Button
                    size="sm"
                    color="primary"
                    onPress={() => setIsMediaModalOpen(true)}
                    className="w-full"
                  >
                    {t(currentLanguage, 'post.form.selectImage')}
                  </Button>
                </div>
                {selectedImageUrl ? (
                  <div className="relative group">
                    <img
                      src={selectedImageUrl}
                      alt="Featured image"
                      className="w-full max-h-80 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-gray-500 text-sm">
                      {t(currentLanguage, 'post.form.noImageSelected')}
                    </p>
                  </div>
                )}
                {errors?.featuredImageId && (
                  <p className="text-xs text-danger mt-1">
                    {errors.featuredImageId.message}
                  </p>
                )}
              </div>
              <MediaSelectModal
                isOpen={isMediaModalOpen}
                onClose={() => setIsMediaModalOpen(false)}
                onSelect={handleMediaSelect}
              />
            </div>
            {/* 更新時のみ */}
            {mode === 'update' && (
              <>
                <Input
                  {...register('slug')}
                  label={t(currentLanguage, 'post.form.slug')}
                  placeholder={t(
                    currentLanguage,
                    'post.form.placeholders.slug'
                  )}
                  isInvalid={!!errors.slug}
                  errorMessage={errors?.slug?.message}
                />
                <Textarea
                  {...register('excerpt')}
                  label={t(currentLanguage, 'post.form.excerpt')}
                  placeholder={t(
                    currentLanguage,
                    'post.form.placeholders.excerpt'
                  )}
                  isInvalid={!!errors.excerpt}
                  errorMessage={errors?.excerpt?.message}
                  minRows={6}
                  maxRows={5}
                />
              </>
            )}
            <div className="mt-4 border-t pt-4">
              <h3 className="text-md font-semibold mb-2">
                {t(currentLanguage, 'post.preview')} {textLength}
              </h3>
              <div className="h-[300px] overflow-y-auto">
                {/* 高さとスクロールを追加 */}
                <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
                  {pretty(contentHtml || '')}
                </pre>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="w-2/3 space-y-6">
        <Card>
          <CardBody className="relative h-[calc(100vh-200px)]">
            <input type="hidden" {...register('content')} />
            <div className="relative h-full">
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
          </CardBody>
        </Card>
      </div>
    </form>
  )
}
