import { TaxonomyListResponse } from '@/types/api/taxonomy/response'

export interface CategoryOption {
  value: string
  label: string
}

export function createCategoryOptions(
  taxonomies: TaxonomyListResponse[] = []
): CategoryOption[] {
  return taxonomies.map(({ id, breadcrumbs }) => ({
    value: id,
    label: breadcrumbs.map((breadcrumb) => breadcrumb.name).join(' / '),
  }))
}

export function getBreadcrumbForCategory(
  categoryId: string,
  taxonomies: TaxonomyListResponse[] = []
): string | null {
  const taxonomy = taxonomies.find(({ id }) => id === categoryId)
  return taxonomy
    ? taxonomy.breadcrumbs.map((breadcrumb) => breadcrumb.name).join(' / ')
    : null
}
