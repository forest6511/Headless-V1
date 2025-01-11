import { NextResponse } from 'next/server'
import { handleAuthCookies } from '@/lib/api/auth/cookieHandler'
import { SignupPayload } from '@/types/api/auth/request'
import { AuthResponse } from '@/types/api/auth/response'
import { ADMIN_API_ENDPOINTS } from '@/config/endpoints'
import { handleErrorResponse } from '@/lib/api/core/server'

export async function POST(request: Request) {
  try {
    const payload: SignupPayload = await request.json()
    console.info(`API BASE URL ${process.env.API_BASE_URL}`)

    const signupUrl = `${process.env.API_BASE_URL}${ADMIN_API_ENDPOINTS.AUTH.SIGNUP}`
    console.info(signupUrl)
    const response = await fetch(signupUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      return handleErrorResponse(response, 'Signup request failed.')
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
