import { NextResponse } from 'next/server'
import { handleAuthCookies } from '@/lib/api/auth/cookieHandler'
import { SignupPayload } from '@/types/api/auth/request'
import { AuthResponse } from '@/types/api/auth/response'
import { ADMIN_API_ENDPOINTS } from '@/config/endpoints'

export async function POST(request: Request) {
  try {
    const payload: SignupPayload = await request.json()

    const signupUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${ADMIN_API_ENDPOINTS.AUTH.SIGNUP}`
    const response = await fetch(signupUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(
        `Signup request failed. Status: ${response.status}, Body: ${errorBody}`
      )
      return NextResponse.json(
        { error: 'signup failed' },
        { status: response.status }
      )
    }

    const authResponse: AuthResponse = await response.json()
    await handleAuthCookies(authResponse)

    return NextResponse.json(authResponse)
  } catch (error) {
    console.error('Unexpected error during signup:', error)
    return NextResponse.json(
      { error: 'unexpected error occurred' },
      { status: 500 }
    )
  }
}
