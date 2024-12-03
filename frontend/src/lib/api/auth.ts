import { apiClient } from './client'
import { API_ENDPOINTS } from '@/config/endpoints'
import type { AuthTokens } from '@/types/auth'
import { SignInPayload, SignupPayload } from '@/types/request'

export const authApi = {
  signin: (payload: SignInPayload) => {
    return apiClient.request(API_ENDPOINTS.AUTH.SIGNIN, {
      method: 'POST',
      body: payload,
    })
  },

  signup: (payload: SignupPayload) => {
    return apiClient.request<AuthTokens>(API_ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      body: payload,
    })
  },
  // logout: () => {
  //   return apiClient.request(API_ENDPOINTS.AUTH.LOGOUT, {
  //     method: 'POST',
  //   });
  // }
}
