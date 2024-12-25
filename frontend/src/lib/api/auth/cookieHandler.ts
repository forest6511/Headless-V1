import { cookies, type UnsafeUnwrappedCookies } from 'next/headers'
import type { AuthResponse } from '@/types/api/auth/response'

/**
 * 認証トークンをサーバーサイドでクッキーに設定する
 * 本番環境ではセキュリティ属性を適切に設定
 */
export const handleAuthCookies = (authResponse: AuthResponse) => {
  // https://nextjs.org/docs/app/building-your-application/upgrading/version-15#temporary-synchronous-usage
  const cookieStore = cookies() as unknown as UnsafeUnwrappedCookies

  const isProduction = process.env.NODE_ENV === 'production'

  cookieStore.set(
    'access_token',
    authResponse.authTokens.accessToken.toString(),
    {
      httpOnly: true,
      secure: isProduction,
      expires: new Date(authResponse.authTokens.expiresAt),
    }
  )

  cookieStore.set(
    'refresh_token',
    authResponse.authTokens.refreshToken.toString(),
    {
      httpOnly: true,
      secure: isProduction,
      expires: new Date(authResponse.authTokens.expiresAt),
    }
  )
}
