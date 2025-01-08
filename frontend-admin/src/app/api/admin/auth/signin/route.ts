import { NextResponse } from 'next/server'
import { handleAuthCookies } from '@/lib/api/auth/cookieHandler'
import { SignupPayload } from '@/types/api/auth/request'
import { AuthResponse } from '@/types/api/auth/response'
import { ADMIN_API_ENDPOINTS } from '@/config/endpoints'

export async function POST(request: Request) {
  try {
    const payload: SignupPayload = await request.json()

    const signinUrl = `${process.env.API_BASE_URL}${ADMIN_API_ENDPOINTS.AUTH.SIGNIN}`
    console.info(signinUrl)
    const response = await fetch(signinUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const status = response.status
      const errorBody = await response.text()
      console.error(
        `Signin request failed. Status: ${status}, Body: ${errorBody}`
      )
      return NextResponse.json(
        { error: 'Failed to request.', details: errorBody },
        { status }
      )
    }

    const authResponse: AuthResponse = await response.json()
    await handleAuthCookies(authResponse)

    return NextResponse.json(authResponse, {
      headers: {
        'Location': '/dashboard'
      }
    })
  } catch (error) {
    console.error('Unexpected error during signin:', error)
    return NextResponse.json(
      { error: 'unexpected error occurred' },
      { status: 500 }
    )
  }
}
