'use client'

import { Button } from '@nextui-org/react'
import { LayoutDashboard, LogOut } from 'lucide-react'

export default function DashboardHeader() {
  return (
    <header className="bg-[#6366F1] text-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="w-6 h-6" />
        <h1 className="text-xl font-bold">管理画面</h1>
      </div>
      <Button
        variant="light"
        startContent={<LogOut size={18} />}
        className="text-white"
      >
        ログアウト
      </Button>
    </header>
  )
}
