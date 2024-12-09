import { apiClient } from '@/lib/api'
import { API_ENDPOINTS } from '@/config/endpoints'

export const postApi = {
  createPost: (payload: CreatePostRequest) => {
    return apiClient.request(API_ENDPOINTS.POST.POST, {
      method: 'POST',
      body: payload,
    })
  },
}
