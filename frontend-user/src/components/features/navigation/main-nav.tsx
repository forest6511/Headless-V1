// components/features/navigation/main-nav.tsx
import { Logo } from '@/components/features/navigation/components/logo'
import { MobileMenu } from '@/components/features/navigation/components/mobile-menu'
import { Category } from '@/types/category'

// プロパティの型定義を追加
interface MainNavProps {
  categories: Category[]
}

export function MainNav({ categories }: MainNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="flex h-14 items-center gap-4">
          <MobileMenu categories={categories} /> {/* カテゴリーを渡す */}
          <Logo />
          <div className="flex flex-1 items-center justify-end gap-4">
            {/* <SearchBar /> */}
            {/* <MobileSearchButton />  モバイル用検索ボタン */}
            {/* <AuthButtons /> */}
          </div>
        </div>
      </div>
    </header>
  )
}
