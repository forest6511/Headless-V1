import { TaxonomyListResponse } from '@/types/api/taxonomy/response'

export interface CategoryOption {
  value: string
  label: string
}

export interface CategoryOption {
  value: string
  label: string
}

export function buildCategoryOptions(
  taxonomies: TaxonomyListResponse[]
): CategoryOption[] {
  if (!taxonomies || taxonomies.length === 0) return []

  return taxonomies.map((taxonomy) => ({
    value: taxonomy.id,
    label: taxonomy.breadcrumbs
      .map((breadcrumb) => breadcrumb.name)
      .join(' / '),
  }))
}
