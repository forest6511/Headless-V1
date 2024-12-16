import { apiClient } from '@/lib/api'
import { API_ENDPOINTS } from '@/config/endpoints'
import { CreatePostRequest, ListPostRequest } from '@/types/api/post/request'

export const postApi = {
  createPost: (payload: CreatePostRequest) => {
    return apiClient.request(API_ENDPOINTS.POST.POST, {
      method: 'POST',
      body: payload,
    })
  },
  getPostList: (params: ListPostRequest) => {
    const queryParams = new URLSearchParams({
      ...(params.cursorPostId && { cursorPostId: params.cursorPostId }),
      ...(params.pageSize && { pageSize: params.pageSize.toString() }),
    })
    const url = `${API_ENDPOINTS.POST.LIST}?${queryParams.toString()}`
    return apiClient.request(url, {
      method: 'GET',
    })
  },
}
