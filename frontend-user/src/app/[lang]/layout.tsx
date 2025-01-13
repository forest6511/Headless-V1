import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { MainNav } from '@/components/features/navigation'
import { LeftSidebar } from '@/components/layouts/sidebar/left-sidebar'
// import { RightSidebar } from '@/components/layouts/sidebar/right-sidebar'
// import { Footer } from '@/components/layouts/footer'
import React from 'react'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'サイトタイトル',
  description: 'サイトタイトル 説明',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
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
