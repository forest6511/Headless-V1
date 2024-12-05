import { TaxonomyType } from '@/types/api/taxonomy/types'

// /api/taxonomies/categories
export interface TaxonomyWithPostRefsResponse {
  id: string
  name: string
  taxonomyType: TaxonomyType
  slug: string
  description: string | null
  parentId: string | null
  createdAt: string
  postIds: string[]
}
