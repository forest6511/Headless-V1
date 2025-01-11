import { NextResponse } from 'next/server'
import { handleAuthCookies } from '@/lib/api/auth/cookieHandler'
import { SignupPayload } from '@/types/api/auth/request'
import { AuthResponse } from '@/types/api/auth/response'
import { ADMIN_API_ENDPOINTS } from '@/config/endpoints'

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
      const status = response.status
      const errorBody = await response.json()
      console.error(
        `Signup request failed. Status: ${response.status}, Body: ${errorBody.error}`
      )
      return NextResponse.json(
        {
          error: 'Failed to request.',
          details: errorBody.error,
        },
        { status }
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
