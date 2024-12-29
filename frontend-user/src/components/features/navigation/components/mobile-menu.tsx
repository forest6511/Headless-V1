import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LeftSidebar } from '@/components/layouts/sidebar/left-sidebar'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="lg:hidden -ml-0">
          <Menu style={{ width: '24px', height: '24px' }} />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <LeftSidebar />
      </SheetContent>
    </Sheet>
  )
}
