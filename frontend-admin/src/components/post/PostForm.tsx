import { PostFormData } from '@/schemas/post'
import { usePostForm } from '@/hooks/post/usePostForm'
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react'
import { PostStatuses } from '@/types/api/post/types'
import TiptapEditor from '@/components/tiptap/TiptapEditor'
import { ChevronDown, Save } from 'lucide-react'
import React from 'react'
import { useCategoryList } from '@/hooks/category/useCategoryList'
import { createCategoryOptions } from '@/lib/utils/category'

interface PostFormProps {
  redirectPath: string
  initialData?: PostFormData
  mode: 'create' | 'update'
}

export function PostForm({ redirectPath, initialData, mode }: PostFormProps) {
  const { categories } = useCategoryList()
  const categoryOptions = createCategoryOptions(categories)
  const { form, textLength, contentHtml, onSubmit, handleEditorChange } =
    usePostForm({
      redirectPath,
      initialData,
      mode,
    })
  const {
    register,
    formState: { errors },
    watch,
  } = form

  return (
    <form onSubmit={onSubmit} className="flex flex-row-reverse gap-6">
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
              {...register('slug')}
              label="スラッグ"
              placeholder="記事のスラッグを入力"
              isInvalid={!!errors.slug}
              errorMessage={errors?.slug?.message}
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
              {...register('postStatus')}
              label="ステータス"
              name="postStatus"
              isInvalid={!!errors.postStatus}
              errorMessage={errors?.postStatus?.message}
            >
              {PostStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">抜粋情報</h2>
          </CardHeader>
          <CardBody>
            <Textarea
              {...register('excerpt')}
              label="抜粋"
              placeholder="記事の抜粋を入力"
              minRows={3}
              isInvalid={!!errors.excerpt}
              errorMessage={errors?.excerpt?.message}
            />
          </CardBody>
        </Card>
      </div>
      <div className="w-2/3 space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">記事内容</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
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
                {contentHtml || ''}
              </pre>
            </div>
          </CardBody>
        </Card>
        <Accordion>
          <AccordionItem
            key="seo-information"
            aria-label="SEO情報"
            title={
              <div className="flex items-center w-full">
                <ChevronDown className="text-default-500 w-5 h-5 mr-2" />
                <h2 className="text-lg font-semibold">SEO情報</h2>
              </div>
            }
          >
            <Card>
              <CardBody className="space-y-4">
                <Input
                  {...register('metaTitle')}
                  label="メタタイトル"
                  placeholder="SEOメタタイトルを入力"
                  isInvalid={!!errors.metaTitle}
                  errorMessage={errors?.metaTitle?.message}
                />
                <Textarea
                  {...register('metaDescription')}
                  label="メタディスクリプション"
                  placeholder="SEOメタディスクリプションを入力"
                  isInvalid={!!errors.metaDescription}
                  errorMessage={errors.metaDescription?.message}
                />
                <Input
                  {...register('metaKeywords')}
                  label="メタキーワード"
                  placeholder="SEOメタキーワードをカンマ区切りで入力"
                  isInvalid={!!errors.metaKeywords}
                  errorMessage={errors?.metaKeywords?.message}
                />
              </CardBody>
            </Card>
          </AccordionItem>
        </Accordion>

        <Accordion>
          <AccordionItem
            key="open-graph"
            aria-label="Open Graph情報"
            title={
              <div className="flex items-center w-full">
                <ChevronDown className="text-default-500 w-5 h-5 mr-2" />
                <h2 className="text-lg font-semibold">Open Graph情報</h2>
              </div>
            }
          >
            <Card>
              <CardBody className="space-y-4">
                <Input
                  {...register('ogTitle')}
                  label="OGタイトル"
                  placeholder="OGタイトルを入力"
                  isInvalid={!!errors.ogTitle}
                  errorMessage={errors?.ogTitle?.message}
                />
                <Textarea
                  {...register('ogDescription')}
                  label="OG説明"
                  placeholder="OG説明を入力"
                  isInvalid={!!errors.ogDescription}
                  errorMessage={errors?.ogDescription?.message}
                />
              </CardBody>
            </Card>
          </AccordionItem>
        </Accordion>
        <div className="flex justify-start">
          <Button
            type="submit"
            color="primary"
            startContent={<Save size={20} />}
          >
            保存
          </Button>
        </div>
      </div>
    </form>
  )
}
