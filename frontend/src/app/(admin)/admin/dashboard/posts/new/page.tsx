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
import { useCategories } from '@/hooks/taxonomy/useCategories'
import { TaxonomyWithPostRefsResponse } from '@/types/api/taxonomy/response'
import { postApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApiError } from '@/lib/api/core/client'
import { useRouter } from 'next/navigation'

export default function NewPostPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {},
    mode: 'onChange',
  })

  const { taxonomies } = useCategories()

  const categories = (() => {
    if (!taxonomies || taxonomies.length === 0) return []

    const categoryMap: Record<string, TaxonomyWithPostRefsResponse[]> = {}
    let roots: TaxonomyWithPostRefsResponse[] = []

    // カテゴリをIDベースで分類
    taxonomies.forEach((category) => {
      if (category.parentId) {
        if (!categoryMap[category.parentId]) {
          categoryMap[category.parentId] = []
        }
        categoryMap[category.parentId].push(category)
      } else {
        roots.push(category) // 親カテゴリ
      }
    })

    // 親カテゴリを名前順にソート
    roots = roots.sort((a, b) => a.name.localeCompare(b.name))

    const buildBreadcrumbLabels = (
      node: TaxonomyWithPostRefsResponse,
      parentLabel: string
    ): { value: string; label: string }[] => {
      const currentLabel = parentLabel
        ? `${parentLabel} / ${node.name}`
        : node.name
      const children = (categoryMap[node.id] || []).sort((a, b) =>
        a.name.localeCompare(b.name)
      )

      if (children.length === 0) {
        // 子カテゴリがない場合、このカテゴリを追加
        return [{ value: node.id, label: currentLabel }]
      }

      // 子カテゴリがある場合、再帰的に処理
      return children.flatMap((child) =>
        buildBreadcrumbLabels(child, currentLabel)
      )
    }

    // すべてのルートカテゴリからラベルを構築
    return roots.flatMap((root) => buildBreadcrumbLabels(root, ''))
  })()

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      await postApi.createPost(data as Post)
      toast.success(`投稿の登録に成功しました`)
      router.push('/admin/dashboard/posts')
    } catch (error) {
      console.error('投稿の登録に失敗しました', error)
      if (error instanceof ApiError) {
        toast.error(`投稿の登録に失敗しました。 ${error?.details}`)
      }
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">新規記事作成</h1>
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
              {categories.map((category) => (
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
        <div className="flex justify-end">
          <Button
            type="submit"
            color="primary"
            startContent={<Save size={20} />}
          >
            保存
          </Button>
        </div>
      </form>
    </div>
  )
}
