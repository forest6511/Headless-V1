import { apiClient } from '@/lib/api'
import { API_ENDPOINTS } from '@/config/endpoints'
import { TaxonomyWithPostRefsResponse } from '@/types/api/taxonomy/response'
import {
  CreateTaxonomyRequest,
  UpdateTaxonomyRequest,
} from '@/types/api/taxonomy/request'

export const taxonomyApi = {
  getCategories: () => {
    return apiClient.request<TaxonomyWithPostRefsResponse[]>(
      API_ENDPOINTS.TAXONOMY.CATEGORIES,
      {
        method: 'GET',
      }
    )
  },
  createCategory: (payload: CreateTaxonomyRequest) => {
    return apiClient.request(API_ENDPOINTS.TAXONOMY.CATEGORY, {
      method: 'POST',
      body: payload,
    })
  },
  updateCategory: (payload: UpdateTaxonomyRequest) => {
    return apiClient.request(API_ENDPOINTS.TAXONOMY.CATEGORY, {
      method: 'PUT',
      body: payload,
    })
  },
}
