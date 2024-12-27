'use client'

import { Input } from '@nextui-org/input'
import { Search } from 'lucide-react'
import { Button } from '@nextui-org/button'
import { Menu } from 'lucide-react'

interface NavbarProps {
  onOpenSidebar: () => void
}

export function Navbar({ onOpenSidebar }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b">
      <div className="h-full flex items-center gap-4">
        <div className="md:hidden flex items-center">
          <Button
            isIconOnly
            variant="light"
            onPress={onOpenSidebar}
            className="ml-4"
          >
            <Menu />
          </Button>
        </div>
        <div className="font-bold text-xl md:ml-6">ブログ</div>
        <div className="flex-1 max-w-xl mx-auto px-4">
          <Input
            classNames={{
              input: 'text-small',
              inputWrapper: 'h-10',
            }}
            placeholder="検索..."
            startContent={<Search size={18} />}
            type="search"
          />
        </div>
        <Button className="mr-4 md:mr-6" color="primary">
          ログイン
        </Button>
      </div>
    </nav>
  )
}
