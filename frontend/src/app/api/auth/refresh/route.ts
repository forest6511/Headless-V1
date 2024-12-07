import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { handleAuthCookies } from '@/lib/api/authCookieHandler'
import { API_ENDPOINTS } from '@/config/endpoints'
import { AuthResponse } from '@/types/api/auth/response'

export async function POST(_request: Request) {
  try {
    const cookieStore = cookies()
    const refreshToken = cookieStore.get('refresh_token')

    const refreshUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`

    const response = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken?.value}`,
      },
      body: JSON.stringify({
        refreshToken: refreshToken?.value,
      }),
    })

    if (!response.ok) {
      const status = response.status
      const errorBody = await response.text()
      console.error(
        `Failed to refresh token. Status: ${status}, Body: ${errorBody}`
      )
      return NextResponse.json(
        { error: 'token refresh failed', details: errorBody },
        { status }
      )
    }

    const authResponse: AuthResponse = await response.json()
    handleAuthCookies(authResponse)

    return NextResponse.json(authResponse)
  } catch (error) {
    console.error('Unexpected error during token refresh:', error)
    return NextResponse.json(
      { error: 'unexpected error occurred' },
      { status: 500 }
    )
  }
}
