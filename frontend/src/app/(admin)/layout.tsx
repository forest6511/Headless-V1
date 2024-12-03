'use client'

import './globals.css'
import { NextUIProvider } from '@nextui-org/react'
import React from 'react'

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={'admin'}>
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  )
}
