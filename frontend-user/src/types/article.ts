// 共通のカテゴリーパス型
type CategoryPath = {
  slug: string
  name: string
  description?: string
}

type Category = {
  path: CategoryPath[]
}

export type FeaturedImage = {
  id: string
  thumbnailUrl: string
  mediumUrl: string
  translations: {
    language: string
    title: string
  }[]
}

// Home
export type ArticleCardProps = {
  slug: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  tags: string[]
  featuredImage?: FeaturedImage // nullable
  category: Category
}

// 記事詳細ページ用
export type ArticlePageProps = {
  slug: string
  title: string
  description: string
  content: string
  createdAt: string
  updatedAt: string
  tags: string[]
  featuredImage?: FeaturedImage // nullable
  category: Category
  // 将来的に追加予定の項目をコメントで残しておく
  // author?: {
  //   name: string
  //   image: string
  // }
  // reactions?: number
  // comments?: number
}
