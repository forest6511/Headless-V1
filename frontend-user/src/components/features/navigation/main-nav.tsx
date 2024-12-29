import { Logo } from '@/components/features/navigation/components/logo'
import { SearchBar } from '@/components/features/navigation/components/search-bar'
import { MobileMenu } from '@/components/features/navigation/components/mobile-menu'
import { AuthButtons } from '@/components/features/navigation/components/auth-buttons'
import { MobileSearchButton } from '@/components/features/navigation/components/mobile-search-button'

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="flex h-14 items-center gap-4">
          <MobileMenu /> {/* SheetTrigger部分 */}
          <Logo />
          <div className="flex flex-1 items-center justify-end gap-4">
            <SearchBar />
            <MobileSearchButton /> {/* モバイル用検索ボタン */}
            <AuthButtons />
          </div>
        </div>
      </div>
    </header>
  )
}
