import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

/**
 * ミドルウェア関数：認証とリダイレクトを処理
 * このミドルウェアは、指定されたルート（matcher）にアクセスする際にアクセストークンの有無を確認します。
 * サーバーサイドで動作し、クライアントから送信されるリクエストの前処理を行います。
 */
export async function middleware(request: NextRequest) {
  // すべての認証チェックを一時的に無効化
  return NextResponse.next()

  /*
  // クッキーからアクセストークンを取得（サーバーサイドの責任として、ブラウザから送信されたクッキーを解析）
  const accessToken = request.cookies.get('access_token')?.value

  // /dashboard で始まるリクエストパスをチェック
  // サーバーサイドでリクエストのパスを解析し、該当するルートへのアクセスを制御
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // アクセストークンがない場合、管理画面のログインページにリダイレクト
    if (!accessToken) {
      // サーバーサイドでリダイレクトを処理し、クライアントに適切なレスポンスを返却
      console.error(`Not logged in. accessToken ${accessToken}`, request)
      return NextResponse.redirect(new URL('/', request.url))
    }

    // accessTokenをsecretで検証
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      await jwtVerify(accessToken, secret)
      // アクセストークンがある場合、そのまま次の処理へ進む
      return NextResponse.next()
    } catch {
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
   */
}
