// components/features/navigation/main-nav.tsx
import { Logo } from '@/components/features/navigation/components/logo'
import { MobileMenu } from '@/components/features/navigation/components/mobile-menu'
import { Category } from '@/types/category'
import { Locale } from '@/types/i18n'

// プロパティの型定義を追加
interface MainNavProps {
  categories: Category[]
  lang: Locale
}

export function MainNav({ categories, lang }: MainNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-md">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="flex h-14 items-center gap-4">
          <MobileMenu categories={categories} lang={lang} />
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
