import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { MainNav } from '@/components/features/navigation'
import { LeftSidebar } from '@/components/layouts/sidebar/left-sidebar'
// import { RightSidebar } from '@/components/layouts/sidebar/right-sidebar'
// import { Footer } from '@/components/layouts/footer'
import React from 'react'
import { siteConfig } from '@/config/site'
import { type Locale } from '@/types/i18n'

// Inter フォントの設定（Latin文字サブセット、スワップ表示）
const inter = Inter({ subsets: ['latin'], display: 'swap' })

// ビューポートの設定
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

// メタデータ生成関数（非同期）
export async function generateMetadata({
  params,
}: {
  params: { lang: Locale }
}): Promise<Metadata> {
  try {
    // params からプロパティを非同期的に取得
    const { lang } = await Promise.resolve(params)

    // サイト設定からデフォルト情報を取得
    const i18n = siteConfig.i18n[lang] || siteConfig.i18n['ja']

    return {
      title: {
        default: i18n.title,
        template: `%s | ${i18n.title}`,
      },
      description: i18n.description,
    }
  } catch {
    return {
      title: 'Tech Blog',
      description: 'Technology Information Blog',
    }
  }
}

// ルートレイアウトコンポーネント（非同期）
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  // params からプロパティを非同期的に取得
  const { lang } = await Promise.resolve(params)

  return (
    <html lang={lang}>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <MainNav />
          <div className="flex-1 flex flex-col">
            <div className="mx-auto w-full max-w-[1440px]">
              <div className="flex">
                <LeftSidebar inLayout />
                <main className="flex-1 min-w-0">
                  <div className="px-0 sm:px-4">{children}</div>
                  {/*<div className="block lg:hidden">*/}
                  {/*  <RightSidebar />*/}
                  {/*</div>*/}
                </main>
                {/*<div className="hidden lg:block">*/}
                {/*  <RightSidebar />*/}
                {/*</div>*/}
              </div>
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      </body>
    </html>
  )
}
