'use client'

import { useState } from 'react'
import {
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
  Card,
  CardBody,
  CardHeader,
} from '@nextui-org/react'
import { Save } from 'lucide-react'

const categories = [
  { value: 'technology', label: '技術' },
  { value: 'lifestyle', label: 'ライフスタイル' },
  { value: 'business', label: 'ビジネス' },
]

const postTypes = [
  { value: 'blog', label: 'ブログ' },
  { value: 'news', label: 'ニュース' },
]

const statuses = [
  { value: 'draft', label: '下書き' },
  { value: 'published', label: '公開済み' },
]

export default function NewPostPage() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    status: '',
    post_type: '',
    content: '',
    excerpt: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // ここで実際のデータ送信処理を行います
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
            />
            <Input
              label="スラッグ"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="記事のスラッグを入力"
            />
            <Select
              label="カテゴリ"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
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
            >
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="投稿タイプ"
              name="post_type"
              value={formData.post_type}
              onChange={handleInputChange}
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
            <Textarea
              label="本文"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="記事の本文を入力"
              minRows={10}
            />
            <Textarea
              label="抜粋"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="記事の抜粋を入力"
              minRows={3}
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
              name="meta_title"
              value={formData.meta_title}
              onChange={handleInputChange}
              placeholder="SEOメタタイトルを入力"
            />
            <Textarea
              label="メタディスクリプション"
              name="meta_description"
              value={formData.meta_description}
              onChange={handleInputChange}
              placeholder="SEOメタディスクリプションを入力"
            />
            <Input
              label="メタキーワード"
              name="meta_keywords"
              value={formData.meta_keywords}
              onChange={handleInputChange}
              placeholder="SEOメタキーワードをカンマ区切りで入力"
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
              name="og_title"
              value={formData.og_title}
              onChange={handleInputChange}
              placeholder="OGタイトルを入力"
            />
            <Textarea
              label="OG説明"
              name="og_description"
              value={formData.og_description}
              onChange={handleInputChange}
              placeholder="OG説明を入力"
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
