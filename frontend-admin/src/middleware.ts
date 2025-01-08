import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

/**
 * ミドルウェア関数：認証とリダイレクトを処理
 * このミドルウェアは、指定されたルート（matcher）にアクセスする際にアクセストークンの有無を確認します。
 * サーバーサイドで動作し、クライアントから送信されるリクエストの前処理を行います。
 */
export async function middleware(request: NextRequest) {
  // クッキーからアクセストークンを取得（サーバーサイドの責任として、ブラウザから送信されたクッキーを解析）
  const accessToken = request.cookies.get('access_token')?.value
  console.log('Middleware initial check:', {
    path: request.nextUrl.pathname,
    hasToken: !!accessToken,
    tokenStart: accessToken?.slice(0, 10),
  })

  // /dashboard で始まるリクエストパスをチェック
  // サーバーサイドでリクエストのパスを解析し、該当するルートへのアクセスを制御
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('Dashboard route check:', {
      path: request.nextUrl.pathname,
      url: request.url,
    })
    // アクセストークンがない場合、管理画面のログインページにリダイレクト
    if (!accessToken) {
      // サーバーサイドでリダイレクトを処理し、クライアントに適切なレスポンスを返却
      console.error('Dashboard access denied:', {
        reason: 'No token found',
        path: request.nextUrl.pathname,
      })
      return NextResponse.redirect(new URL('/', request.url))
    }

    // accessTokenをsecretで検証
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      const verified = await jwtVerify(accessToken, secret)

      console.log('JWT verification success:', {
        iss: verified.payload.iss,
        sub: verified.payload.sub,
        exp: verified.payload.exp,
        iat: verified.payload.iat,
        path: request.nextUrl.pathname,
      })

      // アクセストークンがある場合、そのまま次の処理へ進む
      return NextResponse.next()
    } catch (error) {
      const errorLog = {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorName: error instanceof Error ? error.name : 'Unknown error type',
        path: request.nextUrl.pathname,
        tokenStart: accessToken?.slice(0, 10),
      }
      console.error('JWT verification failed:', errorLog)
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // API認証エラー時のリダイレクト処理
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const response = NextResponse.next()
    if (response.status === 401 || response.status === 403) {
      console.error(`認証エラー: status=${response.status}, status=${response.body}, 
      path=${request.nextUrl.pathname}`)
      return NextResponse.redirect(new URL('/', request.url))
    }
    return response
  }

  // 上記以外のルートでは特別な処理をせず、そのまま次の処理へ進む
  return NextResponse.next()
}

/**
 * ミドルウェアの設定オブジェクト
 * 適用するルートを定義します。
 * サーバーサイドで特定のルートに対してのみミドルウェアを適用する仕組みを提供。
 */
export const config = {
  // /dashboard 以下のすべてのパスに対してミドルウェアを適用
  matcher: '/dashboard/:path*',
}
