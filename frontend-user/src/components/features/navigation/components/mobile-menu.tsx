// components/features/navigation/components/mobile-menu.tsx
'use client'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LeftSidebar } from '@/components/layouts/sidebar/left-sidebar'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Category } from '@/types/category'
import { Locale } from '@/types/i18n'
import { useState } from 'react'

interface MobileMenuProps {
  categories: Category[]
  lang: Locale
}

export function MobileMenu({ categories, lang }: MobileMenuProps) {
  // メニューの開閉状態を管理
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="lg:hidden -ml-3">
          <Menu style={{ width: '24px', height: '24px' }} />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <LeftSidebar
          categories={categories}
          lang={lang}
          // リンククリック時にメニューを閉じる
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
