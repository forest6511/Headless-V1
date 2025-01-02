export interface Translation {
  language: string
  title: string
  excerpt: string
  content: string
}

export interface Tag {
  id: string
  name: string
}

// /api/posts/list
export interface PostListResponse {
  totalCount: number
  posts: PostResponse[]
  totalPages: number
  pageSize: number
}

// /api/posts/{id}
export interface PostResponse {
  id: string
  slug: string
  status: string
  featuredImageId: string | null
  categoryId: string
  tags: Tag[]
  translations: Translation[]
  createdAt: string
  updatedAt: string
}
