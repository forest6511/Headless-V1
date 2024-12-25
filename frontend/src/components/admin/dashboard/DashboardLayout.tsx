'use client'

import { useTokenRefresh } from '@/hooks/auth/useTokenRefresh'
import React from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useTokenRefresh()
  return (
    <div>
      <header>{/* 管理画面用ヘッダー */}</header>
      <main>{children}</main>
    </div>
  )
}
