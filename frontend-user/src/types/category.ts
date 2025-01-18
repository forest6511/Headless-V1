// types/category.ts
export interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  children: Category[]
  fullPath: string
}

// カテゴリ記事一覧のレスポンス用
export interface CategoryWithArticles {
  category: {
    id: string
    slug: string
    name: string
    description: string | null
    parent?: {
      id: string
      slug: string
      name: string
      description: string | null
    }
  }
  articles: {
    slug: string
    title: string
    description: string
    createdAt: string
    updatedAt: string
    tags: string[]
    category: {
      path: {
        slug: string
        name: string
        description: string | null
      }[]
    }
  }[]
}
