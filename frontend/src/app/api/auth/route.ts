import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { AuthPayload } from '@/types/auth'

// サーバー側でクッキー処理
export async function POST(request: Request) {
  try {
    const authPayload: AuthPayload = await request.json()

    // authPayload.jwtResult.tokenを使用
    cookies().set('auth_token', authPayload.jwtResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(authPayload.jwtResult.expiresAt)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }
}