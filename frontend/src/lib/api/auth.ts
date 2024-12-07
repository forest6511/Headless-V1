import { apiClient } from './client'
import { API_ENDPOINTS } from '@/config/endpoints'
import { AuthResponse } from '@/types/api/auth/response'
import { SignInPayload, SignupPayload } from '@/types/api/auth/request'

export const authApi = {
  signin: (payload: SignInPayload) => {
    return apiClient.request(API_ENDPOINTS.AUTH.SIGNIN, {
      method: 'POST',
      body: payload,
    })
  },
  signup: (payload: SignupPayload) => {
    return apiClient.request<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      body: payload,
    })
  },
  refresh: () => {
    return apiClient.request<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      method: 'POST',
    })
  },
  // logout: () => {
  //   return apiClient.request(API_ENDPOINTS.AUTH.LOGOUT, {
  //     method: 'POST',
  //   });
  // }
}
