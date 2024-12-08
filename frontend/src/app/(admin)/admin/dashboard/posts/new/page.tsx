'use client'

import React, { useEffect, useState } from 'react'
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
import { ZodError } from 'zod'
import { CreatePostSchema } from '@/schemas/post'
import { PostStatuses, StatusValue } from '@/types/api/post/types'
import { useCategories } from '@/hooks/taxonomy/useCategories'
import { TaxonomyWithPostRefsResponse } from '@/types/api/taxonomy/response'

const postTypes = [
  { value: 'blog', label: 'ブログ' },
  { value: 'news', label: 'ニュース' },
]

export default function NewPostPage() {
  const [formData, setFormData] = useState<{
    title: string
    slug: string
    category: string
    status: StatusValue
    postType: string
    content: string
    excerpt: string
    metaTitle: string
    metaDescription: string
    metaKeywords: string
    ogTitle: string
    ogDescription: string
  }>({
    title: '',
    slug: '',
    category: '',
    status: 'DRAFT', // 初期値を'DRAFT'に設定
    postType: '',
    content: '',
    excerpt: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogTitle: '',
    ogDescription: '',
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' })) // 入力時にエラーをクリア
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const dataToValidate = {
        ...formData,
        featuredImageId: null,
        robotsMetaTag: null,
        canonicalUrl: null,
        ogImage: null,
      }

      const validatedData = CreatePostSchema.parse(dataToValidate)
      console.log('Validated data:', validatedData)
      // ここで実際のAPI呼び出しを行う
      // await createPost(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: { [key: string]: string } = {}
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path.join('.')] = err.message
          }
        })
        setErrors(newErrors)
      }
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">新規記事作成</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">基本情報</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="タイトル"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="記事のタイトルを入力"
              isInvalid={!!errors.title}
              errorMessage={errors.title}
            />
            <Input
              label="スラッグ"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="記事のスラッグを入力"
              isInvalid={!!errors.slug}
              errorMessage={errors.slug}
            />
            <Select
              label="カテゴリ"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              isInvalid={!!errors.category}
              errorMessage={errors.category}
            >
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="ステータス"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              isInvalid={!!errors.status}
              errorMessage={errors.status}
            >
              {PostStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="投稿タイプ"
              name="postType"
              value={formData.postType}
              onChange={handleInputChange}
              isInvalid={!!errors.postType}
              errorMessage={errors.postType}
            >
              {postTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
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
                label="本文"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="記事の本文を入力"
                disableAutosize
                isInvalid={!!errors.content}
                errorMessage={errors.content}
              />
            </div>
            <Textarea
              label="抜粋"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="記事の抜粋を入力"
              minRows={3}
              isInvalid={!!errors.excerpt}
              errorMessage={errors.excerpt}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">SEO情報</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="メタタイトル"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleInputChange}
              placeholder="SEOメタタイトルを入力"
              isInvalid={!!errors.metaTitle}
              errorMessage={errors.metaTitle}
            />
            <Textarea
              label="メタディスクリプション"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              placeholder="SEOメタディスクリプションを入力"
              isInvalid={!!errors.metaDescription}
              errorMessage={errors.metaDescription}
            />
            <Input
              label="メタキーワード"
              name="metaKeywords"
              value={formData.metaKeywords}
              onChange={handleInputChange}
              placeholder="SEOメタキーワードをカンマ区切りで入力"
              isInvalid={!!errors.metaKeywords}
              errorMessage={errors.metaKeywords}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Open Graph情報</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="OGタイトル"
              name="ogTitle"
              value={formData.ogTitle}
              onChange={handleInputChange}
              placeholder="OGタイトルを入力"
              isInvalid={!!errors.ogTitle}
              errorMessage={errors.ogTitle}
            />
            <Textarea
              label="OG説明"
              name="ogDescription"
              value={formData.ogDescription}
              onChange={handleInputChange}
              placeholder="OG説明を入力"
              isInvalid={!!errors.ogDescription}
              errorMessage={errors.ogDescription}
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
