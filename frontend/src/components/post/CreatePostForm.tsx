'use client'

import React from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react'
import { Save } from 'lucide-react'
import { CreatePostFormData, createPostSchema } from '@/schemas/post'
import { PostStatuses } from '@/types/api/post/types'
import { useCategories } from '@/hooks/category/useCategories'
import { postApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApiError } from '@/lib/api/core/client'
import { useRouter } from 'next/navigation'
import { createCategoryOptions } from '@/lib/utils/category'
import { CreatePostRequest } from '@/types/api/post/request'

interface CreatePostFormProps {
  redirectPath: string
}

export function CreatePostForm({ redirectPath }: CreatePostFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {},
    mode: 'onChange',
  })

  const { categories } = useCategories()
  const categoryOptions = createCategoryOptions(categories)

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      await postApi.createPost(data as CreatePostRequest)
      toast.success(`投稿の登録に成功しました`)
      router.push(redirectPath)
    } catch (error) {
      console.error('投稿の登録に失敗しました', error)
      if (error instanceof ApiError) {
        toast.error(`投稿の登録に失敗しました。 ${error?.details}`)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <h2 className="text-lg font-semibold">本文と抜粋</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div id="content-textarea-wrapper">
            <Textarea
              {...register('content')}
              label="本文"
              placeholder="記事の本文を入力"
              disableAutosize
              isInvalid={!!errors.content}
            />
            <p className={'text-tiny text-danger'}>
              {errors?.content?.message}
            </p>
          </div>
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
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">SEO情報</h2>
        </CardHeader>
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
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Open Graph情報</h2>
        </CardHeader>
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
      <div className="flex justify-start">
        <Button type="submit" color="primary" startContent={<Save size={20} />}>
          保存
        </Button>
      </div>
    </form>
  )
}
