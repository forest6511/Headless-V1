// app/layout.tsx
import type { Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { MainNav } from '@/components/features/navigation'
import { LeftSidebar } from '@/components/layouts/sidebar/left-sidebar'
import type React from 'react'
import { getMetadata } from '@/lib/metadata'
import type { Locale } from '@/types/i18n'
import { getCategories } from '@/lib/api/category'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Footer } from '@/components/layouts/footer'
import { getDictionary } from '@/lib/i18n/dictionaries'
import Script from 'next/script'

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
export default async function RootLayout(props: RootLayoutProps) {
  const params = await props.params

  const { children } = props

  const { lang } = params
  const categories = await getCategories(lang)
  const dictionary = await getDictionary(params.lang)

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
            <MainNav categories={categories} lang={lang} />
          </header>

          {/* メインコンテンツ */}
          <div className="flex-1 flex flex-col">
            {/* 全体の横幅 */}
            <div className="mx-auto w-full max-w-[1150px]">
              {/* フレックスコンテナにパディングを追加 */}
              <div className="flex px-4 sm:px-6 lg:px-8">
                {/* サイドバー */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                  <LeftSidebar inLayout categories={categories} lang={lang} />
                </aside>

                {/* メインコンテンツエリア */}
                <main
                  role="main"
                  className="flex-1 min-w-0 max-w-full lg:max-w-[720px] xl:max-w-[800px]"
                >
                  <div className="px-0 sm:px-4 lg:px-5">{children}</div>
                </main>
              </div>
            </div>
          </div>
          <Footer dictionary={dictionary} lang={params.lang} />
        </div>
      </body>
      <GoogleAnalytics gaId="G-94SCXSW03K" />
    </html>
  )
}
