import { TaxonomyType } from '@/types/api/taxonomy/types'

export interface TaxonomyWithPostRefs {
  id: string
  name: string
  taxonomyType: TaxonomyType
  slug: string
  description: string | null
  parentId: string | null
  createdAt: string
  postIds: string[]
}

export interface Breadcrumb {
  id: string
  name: string
  slug: string
}

// /api/taxonomies/categories
export interface TaxonomyListResponse {
  id: string
  name: string
  taxonomyType: TaxonomyType
  slug: string
  description: string | null
  parentId: string | null
  createdAt: string
  postIds: string[]
  breadcrumbs: Breadcrumb[]
}
