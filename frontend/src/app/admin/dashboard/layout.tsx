'use client'

import AdminDashboardLayout from '@/components/admin/dashboard/AdminDashboardLayout'
import AdminDashboardHeader from '@/components/admin/dashboard/AdminDashboardHeader'
import AdminDashboardSidebar from '@/components/admin/dashboard/AdminDashboardSidebar'
import React from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminDashboardLayout>
      <div className="flex flex-col h-screen">
        <AdminDashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          <AdminDashboardSidebar />
          <main className="flex-1 p-8 overflow-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </AdminDashboardLayout>
  )
}
