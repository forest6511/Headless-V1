interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  postStatus: string
  featuredImageId: string | null
  createdAt: Date
  updatedAt: Date
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  ogTitle: string | null
  ogDescription: string | null
  categoryId: string
  tagNames: string[]
}

// 記事作成時用のインターフェース
export interface CreatePostRequest
  extends Omit<Post, 'id' | 'createdAt' | 'updatedAt'> {}

// 記事更新時用のインターフェース
export interface UpdatePostRequest
  extends Partial<Omit<Post, 'createdAt' | 'updatedAt'>> {
  id: string
}

// 記事一覧用のインターフェース
export interface ListPostRequest {
  cursorPostId?: string
  pageSize?: number
}
