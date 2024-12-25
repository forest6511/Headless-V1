import { CategoryListResponse } from '@/types/api/category/response'

export interface CategoryOption {
  value: string
  label: string
}

export function createCategoryOptions(
  categories: CategoryListResponse[] = []
): CategoryOption[] {
  return categories.map(({ id, breadcrumbs }) => ({
    value: id,
    label: breadcrumbs.map((breadcrumb) => breadcrumb.name).join(' / '),
  }))
}

export function getBreadcrumbForCategory(
  categoryId: string,
  categories: CategoryListResponse[] = []
): string | null {
  const category = categories.find(({ id }) => id === categoryId)
  return category
    ? category.breadcrumbs.map((breadcrumb) => breadcrumb.name).join(' / ')
    : null
}
