import { apiClient } from './client'
import { API_ENDPOINTS } from '@/config/endpoints'
import { TaxonomyWithPostRefsResponse } from '@/types/api/taxonomy/response'
import { TaxonomyCategoryRequest } from '@/types/api/taxonomy/request'

export const taxonomyApi = {
  getCategories: () => {
    return apiClient.request<TaxonomyWithPostRefsResponse[]>(
      API_ENDPOINTS.TAXONOMY.CATEGORIES,
      {
        method: 'GET',
      }
    )
  },
  createCategory: (payload: TaxonomyCategoryRequest) => {
    return apiClient.request(API_ENDPOINTS.TAXONOMY.CATEGORY, {
      method: 'POST',
      body: payload,
    })
  },
  updateCategory: (payload: TaxonomyCategoryRequest) => {
    return apiClient.request(API_ENDPOINTS.TAXONOMY.CATEGORY, {
      method: 'PUT',
      body: payload,
    })
  },
}
