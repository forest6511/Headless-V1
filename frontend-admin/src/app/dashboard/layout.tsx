'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import React, { useEffect } from 'react'
import { useLanguageStore } from '@/stores/admin/languageStore'

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Zustand persist storeのhydrationを実行
    useLanguageStore.persist.rehydrate()
  }, [])

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen">
        <DashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 p-8 overflow-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </DashboardLayout>
  )
}
