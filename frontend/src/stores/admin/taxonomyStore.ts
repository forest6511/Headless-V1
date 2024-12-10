import { create } from 'zustand'
import { TaxonomyListResponse } from '@/types/api/taxonomy/response'

type TaxonomyStore = {
  taxonomies: TaxonomyListResponse[]
  setTaxonomies: (taxonomies: TaxonomyListResponse[]) => void
}

export const useTaxonomyStore = create<TaxonomyStore>((set) => ({
  taxonomies: [],
  setTaxonomies: (taxonomies) => set({ taxonomies }),
}))
