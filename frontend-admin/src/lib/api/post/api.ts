import { apiClient } from '@/lib/api'
import { ADMIN_API_ENDPOINTS } from '@/config/endpoints'
import {
  CreatePostRequest,
  ListPostRequest,
  UpdatePostRequest,
} from '@/types/api/post/request'
import { PostListResponse, PostResponse } from '@/types/api/post/response'

export const postApi = {
  createPost: (payload: CreatePostRequest) => {
    return apiClient.request(ADMIN_API_ENDPOINTS.POST.POST, {
      method: 'POST',
      body: payload,
    })
  },
  updatePost: (payload: UpdatePostRequest) => {
    return apiClient.request(ADMIN_API_ENDPOINTS.POST.POST, {
      method: 'PUT',
      body: payload,
    })
  },
  deletePost: (id: string) => {
    return apiClient.request(`${ADMIN_API_ENDPOINTS.POST.POST}/${id}`, {
      method: 'DELETE',
    })
  },
  getPost: (id: string): Promise<PostResponse> => {
    return apiClient.request(`${ADMIN_API_ENDPOINTS.POST.POST}/${id}`, {
      method: 'GET',
    })
  },
  getPostList: (params: ListPostRequest): Promise<PostListResponse> => {
    const queryParams = new URLSearchParams({
      ...(params.cursorPostId && { cursorPostId: params.cursorPostId }),
      ...(params.pageSize && { pageSize: params.pageSize.toString() }),
    })
    const url = `${ADMIN_API_ENDPOINTS.POST.POST}?${queryParams.toString()}`
    return apiClient.request(url, {
      method: 'GET',
    })
  },
}
