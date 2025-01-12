'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, FolderTree, Image, Users } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'

export default function DashboardSidebar() {
  const pathname = usePathname()
  const currentLanguage = useLanguageStore((state) => state.language)

  const menuItems = [
    {
      title: t(currentLanguage, 'dashboard.sidebar.content'),
      submenu: [
        {
          title: t(currentLanguage, 'dashboard.sidebar.menu.posts'),
          href: ROUTES.DASHBOARD.POSTS.BASE,
          icon: FileText,
        },
        {
          title: t(currentLanguage, 'dashboard.sidebar.menu.categories'),
          href: ROUTES.DASHBOARD.CATEGORIES.BASE,
          icon: FolderTree,
        },
        {
          title: t(currentLanguage, 'dashboard.sidebar.menu.media'),
          href: ROUTES.DASHBOARD.Medias.BASE,
          icon: Image,
        },
      ],
    },
    {
      title: t(currentLanguage, 'dashboard.sidebar.permissions'),
      submenu: [
        {
          title: t(currentLanguage, 'dashboard.sidebar.users'),
          href: '/dashboard/users',
          icon: Users,
        },
      ],
    },
  ]

  return (
    <aside className="w-48 bg-white border-r">
      <nav className="p-4">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-3 px-0">
              {item.title}
            </h2>
            <ul>
              {item.submenu.map((subItem, subIndex) => {
                const Icon = subItem.icon
                return (
                  <li key={subIndex} className="mb-1">
                    <Link
                      href={subItem.href}
                      className={`flex items-center text-sm gap-2 px-3 py-2 rounded-lg transition-colors ${
                        pathname === subItem.href
                          ? 'bg-[#00B900] text-white'
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
  )
}
