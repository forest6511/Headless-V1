'use client'

import DashboardLayout from '@/components/admin/dashboard/DashboardLayout'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import DashboardSidebar from '@/components/admin/dashboard/DashboardSidebar'
import React from 'react'

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
