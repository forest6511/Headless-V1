// /api/posts/list
export interface PostListResponse {
  totalCount: number
  posts: PostWithCategoryId[]
  totalPages: number
  pageSize: number
}

// /api/posts/{id}
export interface PostWithCategoryId {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  postStatus: string
  featuredImageId: string | null
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  ogTitle: string | null
  ogDescription: string | null
  createdAt: string
  updateAt: string
  categoryId: string
}
