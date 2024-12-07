import { NextResponse } from 'next/server'
import { handleAuthCookies } from '@/lib/api/authCookieHandler'
import { SignupPayload } from '@/types/api/auth/request'
import { AuthResponse } from '@/types/api/auth/response'
import { API_ENDPOINTS } from '@/config/endpoints'

export async function POST(request: Request) {
  try {
    const payload: SignupPayload = await request.json()

    const signinUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.AUTH.SIGNIN}`
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
      return NextResponse.json({ error: 'signin failed' }, { status })
    }

    const authResponse: AuthResponse = await response.json()
    handleAuthCookies(authResponse)

    return NextResponse.json(authResponse)
  } catch (error) {
    console.error('Unexpected error during signin:', error)
    return NextResponse.json(
      { error: 'unexpected error occurred' },
      { status: 500 }
    )
  }
}
