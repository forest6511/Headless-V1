import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet'

interface LeftSidebarProps {
  className?: string
  inLayout?: boolean
}

const navLinks = [
  {
    category: 'テクノロジー',
    items: [
      'テクノロジー',
      'サイエンス',
      'IT',
      'ガジェット',
      'AI',
      'プログラミング',
      'VR・AR',
      '3DCG',
    ],
  },
  {
    category: 'カルチャー',
    items: [
      'マンガ',
      '恋愛',
      'アート',
      '読書',
      '芸能',
      '創作',
      '小説',
      '写真',
      'デザイン',
      'アウトドア',
      '乗り物',
      'ホビー・玩具',
    ],
  },
]

export function LeftSidebar({
  className = '',
  inLayout = false,
}: LeftSidebarProps) {
  const content = (
    <div className="flex flex-col h-full">

      <div className="p-4">
        {/* <div className="mb-6">
          <p className="text-muted-foreground mb-4">
            あいうえお。あいうえお。あいうえお。あいうえお。
          </p>
          <p className="text-muted-foreground mb-4">
            あいうえお。あいうえお。あいうえお。あいうえお。
          </p>
          <div className="space-y-2">
            <Button className="w-full" asChild>
              <Link href="/create-account">アカウント作成</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">ログイン</Link>
            </Button>
          </div>
        </div>*/}

        {navLinks.map((section) => (
          <div className="mt-4" key={section.category}>
            <Link className="mb-2 text-sm font-semibold" href="/public">
              {section.category}
            </Link>
            <nav className="-space-y-1">
              {section.items.map((item) => (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                  key={item}
                >
                  <Link href={`/${item.toLowerCase()}`}>{item}</Link>
                </Button>
              ))}
            </nav>
          </div>
        ))}

        {/* <div className="mt-4">
          <Link className="mb-2 text-sm font-semibold" href="/public">
            その他
          </Link>
          <nav className="-space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/code-of-conduct">行動規範</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/privacy">プライバシーポリシー</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/terms">利用規約</Link>
            </Button>
          </nav>
        </div>*/}
      </div>
    </div>
  )

  if (inLayout) {
    return (
      <aside className={`hidden lg:block w-64 min-h-screen ${className}`}>
        <div className="sticky top-16 overflow-y-auto h-[calc(100vh-4rem)]">
          {content}
        </div>
      </aside>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="px-4 pt-4 border-b">
        <SheetTitle className="flex justify-between items-center mb-3">
          <span>Menu</span>
        </SheetTitle>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto">{content}</div>
    </div>
  )
}
