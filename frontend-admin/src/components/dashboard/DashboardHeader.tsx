'use client'

import { Button } from '@nextui-org/react'
import { LayoutDashboard, LogOut } from 'lucide-react'
import { userStore } from '@/stores/admin/userStore'
import { Avatar } from '@nextui-org/avatar'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/config/routes'
import { LanguageSelector } from '@/components/common/LanguageSelector'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'

export default function DashboardHeader() {
  const router = useRouter()
  const { nickname, thumbnailUrl } = userStore()
  const clearUser = userStore((state) => state.clearUser)
  const currentLanguage = useLanguageStore((state) => state.language)

  const handleLogout = () => {
    clearUser()
    router.push(ROUTES.HOME)
  }

  return (
    <header className="bg-[#00B900] text-white shadow-md p-1 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="w-5 h-5" />
        <h1 className="text-lg font-bold">
          {t(currentLanguage, 'dashboard.header.title')}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <LanguageSelector />
        <Avatar
          src={thumbnailUrl || undefined}
          name={nickname?.charAt(0) || '?'}
          className="w-8 h-8"
          showFallback
        />
        <Button
          variant="light"
          size="md"
          startContent={<LogOut size={20} />}
          className="text-white"
          onPress={handleLogout}
        >
          {t(currentLanguage, 'dashboard.header.logout')}
        </Button>
      </div>
    </header>
  )
}
