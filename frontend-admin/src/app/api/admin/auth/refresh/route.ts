import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { handleAuthCookies } from '@/lib/api/auth/cookieHandler'
import { ADMIN_API_ENDPOINTS } from '@/config/endpoints'
import { AuthResponse } from '@/types/api/auth/response'
import { handleErrorResponse } from '@/lib/api/core/server'

export async function POST(_request: Request) {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refresh_token')

    const refreshUrl = `${process.env.API_BASE_URL}${ADMIN_API_ENDPOINTS.AUTH.REFRESH_TOKEN}`
    console.info(refreshUrl)
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
      return handleErrorResponse(response, 'Failed to refresh token.')
    }

    const authResponse: AuthResponse = await response.json()
    await handleAuthCookies(authResponse)

    return NextResponse.json(authResponse)
  } catch (error) {
    console.error('Unexpected error during token refresh:', error)
    return NextResponse.json(
      { error: 'unexpected error occurred' },
      { status: 500 }
    )
  }
}
