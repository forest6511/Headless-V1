export interface Breadcrumb {
  id: string
  name: string
  slug: string
}

// /api/categories/categories
export interface CategoryListResponse {
  id: string
  name: string
  slug: string
  description: string | null
  parentId: string | null
  createdAt: string
  postIds: string[]
  breadcrumbs: Breadcrumb[]
}
