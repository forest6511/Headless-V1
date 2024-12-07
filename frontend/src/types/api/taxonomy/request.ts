import { TaxonomyType } from '@/types/api/taxonomy/types'

export interface TaxonomyCategoryRequest {
  name: string
  type: TaxonomyType
  slug: string
  description?: string
  parentId?: string
}
