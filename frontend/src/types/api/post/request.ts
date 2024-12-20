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
}

// 投稿作成時用のインターフェース
export interface CreatePostRequest
  extends Omit<Post, 'id' | 'createdAt' | 'updatedAt'> {}

// 投稿更新時用のインターフェース
export interface UpdatePostRequest extends Partial<Omit<Post, 'createdAt' | 'updatedAt'>> {
  id: string
}

// 投稿一覧用のインターフェース
export interface ListPostRequest {
  cursorPostId?: string
  pageSize?: number
}
