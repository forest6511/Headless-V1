import { Language } from '@/types/api/common/types'
import { CategoryListResponse } from '@/types/api/category/response'

export interface CategoryOption {
  value: string
  label: string
}

export function createCategoryOptions(
  categories: CategoryListResponse[] = [],
  language: Language
): CategoryOption[] {
  return categories.map(({ id, breadcrumbs }) => ({
    value: id,
    label: breadcrumbs
      .map(
        (breadcrumb) =>
          breadcrumb.translations.find((t) => t.language === language)?.name ??
          ''
      )
      .join(' / '),
  }))
}

export function getBreadcrumbForCategory(
  categoryId: string,
  categories: CategoryListResponse[] = [],
  language: Language
): string | null {
  const category = categories.find(({ id }) => id === categoryId)
  return category
    ? category.breadcrumbs
        .map(
          (breadcrumb) =>
            breadcrumb.translations.find((t) => t.language === language)
              ?.name ?? ''
        )
        .join(' / ')
    : null
}
