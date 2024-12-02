import Cookies from 'js-cookie'
import { AuthPayload } from '@/types/auth'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface RequestConfig {
  method: HttpMethod
  headers?: HeadersInit
  body?: any
}

const logRequest = (url: string, method: string, body: any) => {
  console.log(`Request - ${method} ${url}`, body)
}

const logResponse = (url: string, response: any) => {
  console.log(`Response - ${url}`, response)
}

const logError = (url: string, error: any) => {
  console.error(`Error - ${url}`, error.message || error)
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
    Cookies.set('auth_token', authPayload.jwtResult.token, {
      expires: new Date(authPayload.jwtResult.expiresAt),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
  },

  getAuthToken(): string | null {
    return Cookies.get('auth_token') ?? null
  },

  removeAuthToken() {
    Cookies.remove('auth_token')
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

    logRequest(url, config.method, config.body)

    try {
      const response = await fetch(url, {
        ...config,
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
      })

      const responseData = await response.json()
      logResponse(url, responseData)

      if (!response.ok) {
        if (response.status === 401) {
          this.removeAuthToken()
        }
        throw new ApiError(response.status, 'API request failed')
      }

      return responseData
    } catch (error) {
      logError(url, error)
      if (error instanceof ApiError) {
        throw error
      }
      throw new Error('Network error')
    }
  },
}
