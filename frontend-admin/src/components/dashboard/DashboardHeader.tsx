'use client'

import { Button } from '@nextui-org/react'
import { LayoutDashboard, LogOut } from 'lucide-react'

export default function DashboardHeader() {
  return (
    <header className="bg-[#6366F1] text-white shadow-md p-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="w-5 h-5" />
        <h1 className="text-lg font-bold">管理画面</h1>
      </div>
      <Button
        variant="light"
        size="md"
        startContent={<LogOut size={20} />}
        className="text-white"
      >
        ログアウト
      </Button>
    </header>
  )
}
