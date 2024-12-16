interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  postStatus: string
  featuredImageId?: string
  createdAt: Date
  updatedAt: Date
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  robotsMetaTag?: string
  ogTitle?: string
  ogDescription?: string
  categoryId: string
}

// 投稿作成時用のインターフェース
export interface CreatePostRequest
  extends Omit<Post, 'id' | 'createdAt' | 'updatedAt'> {}

// 投稿更新時用のインターフェース
interface UpdatePostRequest
  extends Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt'>> {}

// 投稿一覧用のインターフェース
export interface ListPostRequest {
  cursorPostId?: string
  pageSize?: number
}
