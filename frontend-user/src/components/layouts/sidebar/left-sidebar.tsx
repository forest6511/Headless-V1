// components/layouts/sidebar/left-sidebar.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Category } from '@/types/category'
import { Locale } from '@/types/i18n'

interface LeftSidebarProps {
  className?: string
  inLayout?: boolean
  categories: Category[]
  lang: Locale
}

function CategoryMenu({
  category,
  lang,
}: {
  category: Category
  lang: Locale
}) {
  return (
    <div className="mt-2">
      <Link
        className="text-sm text-gray-700 font-medium mb-0.5"
        href={`/${lang}/categories/${category.slug}`}
      >
        {category.name}
      </Link>
      <nav className="space-y-0.5 md:space-y-0.5">
        {category.children.map((child, index) => (
          <Button
            key={child.id}
            variant="ghost"
            className={`w-full justify-start
         min-h-[44px]
         md:min-h-[24px]
         md:py-1.5 md:px-3
         text-sm md:text-sm
         sm:text-base
         ${index === category.children.length - 1 ? '-mb-4' : ''}`}
            asChild
          >
            <Link
              className="text-gray-500 w-full h-full"
              href={`/${lang}/categories/${category.slug}/${child.slug}`}
            >
              {child.name}
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  )
}

export function LeftSidebar({
  className = '',
  inLayout = false,
  categories,
  lang,
}: LeftSidebarProps) {
  const content = (
    <div className="flex flex-col h-full">
      <div className="p-4">
        {/* 未実装のアカウント関連機能 */}
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

        {categories.map((category) => (
          <CategoryMenu key={category.id} category={category} lang={lang} />
        ))}

        {/* その他のメニュー（将来実装予定） */}
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
