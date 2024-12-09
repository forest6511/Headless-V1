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

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}

const isNonGetMethod = (method: HttpMethod): boolean => {
  return method !== 'GET'
}

export const apiClient = {
  router: null as any,

  async handleResponse<T>(url: string, response: Response): Promise<T> {
    const responseData = await response.json()
    logResponse(url, response)

    if (response.status === 401 || response.status === 403) {
      if (process.env.NODE_ENV === 'production') {
        window.location.href = '/admin'
      } else {
        console.error('認証エラーが発生しました')
      }
      const error = new ApiError(response.status, 'API request unauthorized')
      logError(url, error)
      throw error
    }

    if (!response.ok) {
      const error = new ApiError(response.status, 'API request failed')
      logError(url, error)
      throw error
    }

    return responseData
  },

  async request<T>(endpoint: string, config: RequestConfig): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    const url = isNonGetMethod(config.method)
      ? endpoint
      : `${baseUrl}${endpoint}`

    const requestHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    }

    logRequest(url, config.method, config.body)

    try {
      const response = await fetch(url, {
        ...config,
        headers: requestHeaders,
        body: config.body ? JSON.stringify(config.body) : undefined,
        credentials: 'include',
      })

      return await this.handleResponse<T>(url, response)
    } catch (error) {
      logError(url, error)
      throw error
    }
  },
}
