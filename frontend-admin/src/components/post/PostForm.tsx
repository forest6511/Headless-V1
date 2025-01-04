import { PostFormData } from '@/schemas/post'
import { usePostForm } from '@/hooks/post/usePostForm'
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react'
import { PostStatuses } from '@/types/api/post/types'
import TiptapEditor from '@/components/tiptap/TiptapEditor'
import React, { useEffect } from 'react'
import { useCategoryList } from '@/hooks/category/useCategoryList'
import { createCategoryOptions } from '@/lib/utils/category'
import pretty from 'pretty'

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
  const { categories } = useCategoryList()
  const categoryOptions = createCategoryOptions(categories)
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
          <CardHeader>
            <h2 className="text-lg font-semibold">基本情報</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              {...register('title')}
              label="タイトル"
              placeholder="記事のタイトルを入力"
              isInvalid={!!errors.title}
              errorMessage={errors?.title?.message}
            />
            <Input
              {...register('tagNames')}
              label="ハッシュタグ"
              placeholder="#をつけてカンマ形式で入力. ex #beauty, #diet"
              isInvalid={!!errors.tagNames}
              errorMessage={errors?.tagNames?.message}
            />
            <Select
              {...register('categoryId')}
              label="カテゴリ"
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
              label="ステータス"
              name="postStatus"
              isInvalid={!!errors.status}
              errorMessage={errors?.status?.message}
            >
              {PostStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
        </Card>
      </div>
      <div className="w-2/3 space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">記事内容</h2>
          </CardHeader>
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
                プレビュー 文字数: {textLength}
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
