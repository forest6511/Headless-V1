export interface BreadcrumbTranslation {
  language: string
  name: string
}

export interface Breadcrumb {
  id: string
  slug: string
  translations: BreadcrumbTranslation[]
}

export interface CategoryTranslation {
  language: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface CategoryListResponse {
  id: string
  slug: string
  parentId: string | null
  translations: CategoryTranslation[]
  createdAt: string
  postIds: string[]
  breadcrumbs: Breadcrumb[]
}