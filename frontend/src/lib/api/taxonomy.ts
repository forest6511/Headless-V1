import { apiClient } from './client'
import { API_ENDPOINTS } from '@/config/endpoints'
import { TaxonomyWithPostRefsResponse } from '@/types/api/taxonomy/response'

export const taxonomyApi = {
  getCategories: () => {
    return apiClient.request<TaxonomyWithPostRefsResponse[]>(
      API_ENDPOINTS.TAXONOMY.CATEGORIES,
      {
        method: 'GET',
      }
    )
  },
}
