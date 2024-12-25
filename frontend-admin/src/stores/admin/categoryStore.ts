import { create } from 'zustand'
import { CategoryListResponse } from '@/types/api/category/response'

type CategoryStore = {
  categories: CategoryListResponse[]
  setCategories: (categories: CategoryListResponse[]) => void
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
}))
