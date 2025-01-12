'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/react'
import { Plus } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'

export const AddCategoryButton = () => {
  const router = useRouter()
  const currentLanguage = useLanguageStore((state) => state.language)

  return (
    <Button
      color="primary"
      startContent={<Plus size={20} />}
      onPress={() => router.push(ROUTES.DASHBOARD.CATEGORIES.NEW)}
    >
      {t(currentLanguage, 'common.addNew')}
    </Button>
  )
}
