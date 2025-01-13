import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const locales = ['ja', 'en']
const defaultLocale = 'ja'

// Accept-Languageヘッダーに基づいてロケールを取得
function getLocale(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // Accept-Languageヘッダーから言語を取得
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  return match(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 静的ファイルやAPIリクエストはスキップ
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // すでにロケールパスがある場合はそのまま通す
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // ルートパスへのアクセスの場合
  if (pathname === '/') {
    const locale = getLocale(request)
    // 302リダイレクト（一時的なリダイレクト）を使用
    return NextResponse.redirect(new URL(`/${locale}`, request.url), {
      status: 302
    })
  }

  // その他のパスの場合
  const locale = getLocale(request)
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url), {
    status: 302
  })
}

// より具体的なmatcherパターン
export const config = {
  matcher: [
    // ルートパス
    '/',
    // _next, api, 静的ファイル以外のすべてのパス
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ]
}