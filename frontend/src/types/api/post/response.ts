import { TaxonomyType } from '@/types/api/taxonomy/types'

// /api/posts/list
export interface PostListResponse {
  totalCount: number
  posts: PostWithTaxonomies[]
  totalPages: number
  pageSize: number
}

export interface Taxonomies {
  id: string
  name: string
  taxonomyType: TaxonomyType
  slug: string
  description: string | null
  parentId: string | null
  createdAt: string
}

export interface PostWithTaxonomies {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  postStatus: string
  featuredImageId?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  robotsMetaTag?: string
  ogTitle?: string
  ogDescription?: string
  updateAt: string
  taxonomies: Taxonomies[]
}
