import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { AuthResponse } from '@/types/auth'
import { API_ENDPOINTS } from '@/config/endpoints'

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const refreshToken = cookieStore.get('refresh_token')

    if (!refreshToken?.value) {
      console.warn('not found refresh token:', refreshToken?.value)
      return NextResponse.json(
        { error: 'refresh token not found' },
        { status: 401 }
      )
    }
    const refreshUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`
    const refreshResponse = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken?.value}`, // 認証ヘッダーを追加
      },
      body: JSON.stringify({
        refreshToken: refreshToken?.value,
      }),
    })

    if (!refreshResponse.ok) {
      const errorData = await refreshResponse.text()
      console.error('token refresh error:', errorData)
      return NextResponse.json(
        { error: 'token refresh failed' },
        { status: refreshResponse.status }
      )
    }

    const authResponse: AuthResponse = await refreshResponse.json()

    // Set the new access and refresh tokens in the response cookies
    // TODO クッキーのセキュリティー
    cookieStore.set(
      'access_token',
      authResponse.authTokens.accessToken.toString(),
      {
        httpOnly: true,
        secure: true,
        expires: new Date(authResponse.authTokens.expiresAt),
      }
    )
    cookieStore.set(
      'refresh_token',
      authResponse.authTokens.refreshToken.toString(),
      {
        httpOnly: true,
        secure: true,
        expires: new Date(authResponse.authTokens.expiresAt),
      }
    )
    return NextResponse.json(authResponse)
  } catch (error) {
    console.error('refresh token error:', error)
    return NextResponse.json({ error: 'token refresh failed' }, { status: 401 })
  }
}
