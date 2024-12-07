import { create } from 'zustand'
import { TaxonomyWithPostRefsResponse } from '@/types/api/taxonomy/response'

type TaxonomyStore = {
  taxonomies: TaxonomyWithPostRefsResponse[]
  setTaxonomies: (taxonomies: TaxonomyWithPostRefsResponse[]) => void
}

export const useTaxonomyStore = create<TaxonomyStore>((set) => ({
  taxonomies: [],
  setTaxonomies: (taxonomies) => set({ taxonomies }),
}))
