'use client'

import './globals.css'
import { NextUIProvider } from '@nextui-org/react'
import React from 'react'
import { Toaster } from 'react-hot-toast'

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={'admin'}>
        <NextUIProvider>
          {children}
          <Toaster />
        </NextUIProvider>
      </body>
    </html>
  )
}
