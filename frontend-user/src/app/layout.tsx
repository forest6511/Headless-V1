'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { RightSidebar } from '@/components/right-sidebar'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="relative min-h-screen">
          <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
          <div className="flex pt-16">
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
            <div className="flex-1 container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
                <main>{children}</main>
                <RightSidebar />
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
