export interface MediaTranslation {
  language: string
  title: string
}

export interface FeaturedImage {
  id: string
  thumbnailUrl: string
  mediumUrl: string
  translations: MediaTranslation[]
}

export interface Translation {
  language: string
  status: string
  title: string
  excerpt: string
  content: string
}

export interface Tag {
  id: string
  name: string
  slug: string // slugも追加されています
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
  featuredImageId: string | null
  featuredImage: FeaturedImage | null
  categoryId: string
  tags: Tag[]
  translations: Translation[]
  createdAt: string
  updatedAt: string
}
