'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@nextui-org/react'
import {
  LogOut,
  LayoutDashboard,
  FileText,
  FolderTree,
  Users,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const menuItems = [
    {
      title: 'コンテンツ',
      submenu: [
        { title: '記事投稿', href: '/admin/dashboard/posts', icon: FileText },
        {
          title: 'カテゴリ',
          href: '/admin/dashboard/categories',
          icon: FolderTree,
        },
      ],
    },
    {
      title: '権限管理',
      submenu: [
        { title: 'ユーザー', href: '/admin/dashboard/users', icon: Users },
      ],
    },
  ]

  return (
    <div className="flex flex-col h-screen">
      {/* ヘッダー */}
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

      <div className="flex flex-1 overflow-hidden">
        {/* サイドバー */}
        <aside className="w-64 bg-white border-r">
          <nav className="p-4">
            {menuItems.map((item, index) => (
              <div key={index} className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 mb-3 px-3">
                  {item.title}
                </h2>
                <ul>
                  {item.submenu.map((subItem, subIndex) => {
                    const Icon = subItem.icon
                    return (
                      <li key={subIndex} className="mb-1">
                        <Link
                          href={subItem.href}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                            pathname === subItem.href
                              ? 'bg-[#6366F1] text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{subItem.title}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 p-8 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
