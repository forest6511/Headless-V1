import { type Locale } from './i18n'

// APIレスポンス型（すでにPUBLISHEDのみ）
export type ArticleTranslation = {
  language: Locale
  title: string
  excerpt: string
  content: string
}

export type Article = {
  id: string
  slug: string
  featuredImageId: string | null
  categoryId: string
  tags: string[]
  translations: ArticleTranslation[]
  createdAt: string
  updatedAt: string
}

// トップページ用の記事型
export type TopPageArticle = {
  id: string
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
}
