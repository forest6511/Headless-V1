// middleware.ts
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/types/i18n'

function getLocale(request: NextRequest): Locale {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  return match(languages, LOCALES, DEFAULT_LOCALE) as Locale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // robots.txtとsitemap.xmlはNext.jsのルーティングに任せる
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') {
    return NextResponse.next()
  }

  // 静的ファイルやAPIリクエストはスキップ
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // すでにロケールパスがある場合はそのまま通す
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // ルートパスへのアクセスの場合
  if (pathname === '/') {
    const locale = getLocale(request)
    return NextResponse.redirect(new URL(`/${locale}`, request.url), {
      status: 302,
    })
  }

  // その他のパスの場合
  const locale = getLocale(request)
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url), {
    status: 302,
  })
}

export const config = {
  matcher: [
    '/',
    '/robots.txt',
    '/sitemap.xml',
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
