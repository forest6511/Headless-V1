import { cookies } from 'next/headers'
import type { AuthResponse } from '@/types/api/auth/response'

/**
 * 認証トークンをサーバーサイドでクッキーに設定する
 * 本番環境ではセキュリティ属性を適切に設定
 */
export const handleAuthCookies = async (authResponse: AuthResponse) => {
  // https://nextjs.org/docs/app/building-your-application/upgrading/version-15#temporary-synchronous-usage
  const cookieStore = await cookies()

  const isProduction = process.env.NODE_ENV === 'production'

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    expires: new Date(authResponse.authTokens.expiresAt),
    sameSite: 'strict' as const,
    ...(isProduction && { domain: '.miwara.com' }) // 本番環境のみドメイン設定を追加
  }

  cookieStore.set(
    'access_token',
    authResponse.authTokens.accessToken.toString(),
    cookieOptions
  )

  cookieStore.set(
    'refresh_token',
    authResponse.authTokens.refreshToken.toString(),
    cookieOptions
  )
}
