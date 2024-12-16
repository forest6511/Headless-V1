import { apiClient } from '@/lib/api'
import { ADMIN_API_ENDPOINTS } from '@/config/endpoints'
import { CategoryListResponse } from '@/types/api/category/response'
import {
  CreateCategoryRequest,
  DeleteCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/api/category/request'

export const categoryApi = {
  getCategories: () => {
    return apiClient.request<CategoryListResponse[]>(
      ADMIN_API_ENDPOINTS.CATEGORY.CATEGORIES,
      {
        method: 'GET',
      }
    )
  },
  createCategory: (payload: CreateCategoryRequest) => {
    return apiClient.request(ADMIN_API_ENDPOINTS.CATEGORY.CATEGORY, {
      method: 'POST',
      body: payload,
    })
  },
  updateCategory: (payload: UpdateCategoryRequest) => {
    return apiClient.request(ADMIN_API_ENDPOINTS.CATEGORY.CATEGORY, {
      method: 'PUT',
      body: payload,
    })
  },
  deleteCategory: (payload: DeleteCategoryRequest) => {
    return apiClient.request(ADMIN_API_ENDPOINTS.CATEGORY.CATEGORY, {
      method: 'DELETE',
      body: payload,
    })
  },
}
