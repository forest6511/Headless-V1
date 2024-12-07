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

      const responseData = await response.json()
      logResponse(url, responseData)

      if (response.status === 401 || response.status === 403) {
        window.location.href = '/admin'
        throw new ApiError(response.status, 'API request unauthorized')
      }

      if (!response.ok) {
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
