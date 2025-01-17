// app/layout.tsx
import type { Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { MainNav } from '@/components/features/navigation'
import { LeftSidebar } from '@/components/layouts/sidebar/left-sidebar'
import React from 'react'
import { getMetadata } from '@/lib/metadata'
import { type Locale } from '@/types/i18n'

// Inter フォントの設定（Latin文字サブセット、スワップ表示）
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  // 可変フォントの最適化
  variable: '--font-inter',
  preload: true,
})

// ビューポートの設定をより詳細に
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // モバイルでのピンチズームを許可
  maximumScale: 5,
  // PWA対応のためのメタデータ
  themeColor: '#ffffff',
  // Safariでの表示最適化
  viewportFit: 'cover',
}

// メタデータ生成関数（非同期）
export const generateMetadata = getMetadata

type RootLayoutProps = {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}

// ルートレイアウトコンポーネント（非同期）
export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { lang } = await Promise.resolve(params)

  return (
    <html
      lang={lang}
      // フォント最適化のためのクラス追加
      className={`${inter.variable} font-sans`}
    >
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* ヘッダー */}
          <header>
            <MainNav />
          </header>

          {/* メインコンテンツ */}
          <div className="flex-1 flex flex-col">
            <div className="mx-auto w-full max-w-[1440px]">
              <div className="flex">
                {/* サイドバー */}
                <aside>
                  <LeftSidebar inLayout />
                </aside>

                {/* メインコンテンツエリア */}
                <main role="main" className="flex-1 min-w-0">
                  <div className="px-0 sm:px-4">{children}</div>
                </main>

                {/* 将来の右サイドバー実装用にコメントを残す */}
                {/*<aside className="hidden lg:block">*/}
                {/*  <RightSidebar />*/}
                {/*</aside>*/}
              </div>
            </div>
          </div>

          {/* 将来のフッター実装用にコメントを残す */}
          {/* <Footer /> */}
        </div>
      </body>
    </html>
  )
}
