// types/category.ts
export interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  children: Category[]
  fullPath: string
}
