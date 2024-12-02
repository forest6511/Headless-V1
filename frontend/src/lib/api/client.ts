import { cookies } from 'next/headers'
import { AuthPayload } from '@/types/auth'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface RequestConfig {
  method: HttpMethod
  headers?: HeadersInit
  body?: any
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}

export const apiClient = {
  setAuthToken(authPayload: AuthPayload) {
    cookies().set('auth_token', authPayload.jwtResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(authPayload.jwtResult.expiresAt),
    })
  },

  getAuthToken(): string | null {
    return cookies().get('auth_token')?.value ?? null
  },

  removeAuthToken() {
    cookies().delete('auth_token')
  },

  async request<T>(endpoint: string, config: RequestConfig): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    const url = `${baseUrl}${endpoint}`

    const authToken = this.getAuthToken()
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...config.headers,
    }

    try {
      const response = await fetch(url, {
        ...config,
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
      })

      if (!response.ok) {
        if (response.status === 401) {
          this.removeAuthToken()
        }
        throw new ApiError(response.status, 'API request failed')
      }

      return response.json()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new Error('Network error')
    }
  },
}
