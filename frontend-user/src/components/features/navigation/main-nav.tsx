import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Menu, Search } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LeftSidebar } from '../../layouts/sidebar/left-sidebar'

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="flex h-16 items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="lg:hidden">
                <Menu style={{ width: '24px', height: '24px' }} />
                <span className="sr-only">メニューを開く</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <LeftSidebar />
            </SheetContent>
          </Sheet>

          <Link href="/public" className="flex items-center lg:ml-0 -ml-4">
            <div className="bg-black text-white px-2 py-1 text-xl font-bold">
              Log
            </div>
          </Link>

          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="relative hidden md:block flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="検索..." className="pl-8" />
              <span className="absolute right-2.5 top-2.5 text-xs text-muted-foreground"></span>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
              <span className="sr-only">検索</span>
            </Button>
            <nav className="flex items-center gap-2">
              <Button variant="ghost" className="hidden md:inline-flex" asChild>
                <Link href="/login">ログイン</Link>
              </Button>
              <Button asChild>
                <Link href="/create-account">アカウント作成</Link>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
