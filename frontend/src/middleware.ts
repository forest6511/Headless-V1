import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * ミドルウェア関数：認証とリダイレクトを処理
 * このミドルウェアは、指定されたルート（matcher）にアクセスする際にアクセストークンの有無を確認します。
 * サーバーサイドで動作し、クライアントから送信されるリクエストの前処理を行います。
 */
export async function middleware(request: NextRequest) {
  // クッキーからアクセストークンを取得（サーバーサイドの責任として、ブラウザから送信されたクッキーを解析）
  const accessToken = request.cookies.get('access_token')?.value

  console.log('access_token', accessToken)

  // /admin/dashboard で始まるリクエストパスをチェック
  // サーバーサイドでリクエストのパスを解析し、該当するルートへのアクセスを制御
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    // アクセストークンがない場合、管理画面のログインページにリダイレクト
    if (!accessToken) {
      // サーバーサイドでリダイレクトを処理し、クライアントに適切なレスポンスを返却
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    // アクセストークンがある場合、そのまま次の処理へ進む
    return NextResponse.next()
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
  // /admin/dashboard 以下のすべてのパスに対してミドルウェアを適用
  matcher: '/admin/dashboard/:path*',
}
