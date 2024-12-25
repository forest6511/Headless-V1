import { ROUTES } from '@/config/routes'
import { redirect } from 'next/navigation'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface RequestConfig {
  method: HttpMethod
  headers?: HeadersInit
  body?: any
}

const logRequest = (url: string, method: string, body: any) => {
  console.log(`Request - ${method} ${url}`, body)
}

const logResponse = (url: string, response: Response) => {
  const status = response.status
  const statusText = response.statusText
  console.log(`Response - ${url}, Status: ${status} (${statusText})`)
}

const logError = (url: string, error: any) => {
  console.error(`Error - ${url}`, error.message || error)
}

interface ErrorResponse {
  error: string
  details: string
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const apiClient = {
  async handleResponse<T>(url: string, response: Response): Promise<T> {
    const responseData = await response.json()
    logResponse(url, response)

    if (response.status === 401 || response.status === 403) {
      console.error('認証エラーが発生しました', response.status)
      redirect(ROUTES.HOME)
    }

    if (!response.ok) {
      const errorResponse =
        response.status === 409
          ? (responseData as ErrorResponse)
          : { error: 'An unknown error occurred', details: '' }

      const apiError = new ApiError(
        response.status,
        errorResponse.error,
        errorResponse.details
      )

      logError(url, apiError)
      throw apiError
    }

    return responseData
  },

  async request<T>(endpoint: string, config: RequestConfig): Promise<T> {
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    }

    logRequest(endpoint, config.method, config.body)

    try {
      const response = await fetch(endpoint, {
        ...config,
        headers: requestHeaders,
        body: config.body ? JSON.stringify(config.body) : undefined,
        credentials: 'include',
      })

      return await this.handleResponse<T>(endpoint, response)
    } catch (error) {
      logError(endpoint, error)
      throw error
    }
  },
}
