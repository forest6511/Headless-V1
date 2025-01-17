// components/features/navigation/components/mobile-menu.tsx
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LeftSidebar } from '@/components/layouts/sidebar/left-sidebar'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Category } from '@/types/category'

// プロパティの型定義を追加
interface MobileMenuProps {
  categories: Category[]
}

export function MobileMenu({ categories }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="lg:hidden -ml-3">
          <Menu style={{ width: '24px', height: '24px' }} />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <LeftSidebar categories={categories} />
      </SheetContent>
    </Sheet>
  )
}
