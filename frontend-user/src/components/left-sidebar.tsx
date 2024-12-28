import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Radio, Video, Tag, HelpCircle, ShoppingBag, Heart, Trophy, Sparkles, Scale, Shield, Eye, X } from 'lucide-react'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface LeftSidebarProps {
  className?: string;
  inLayout?: boolean;
}

export function LeftSidebar({ className = "", inLayout = false }: LeftSidebarProps) {
  const content = (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="mb-6">
          <p className="text-muted-foreground mb-4">
            DEV Communityは2,593,776人の素晴らしい開発者のコミュニティです
          </p>
          <p className="text-muted-foreground mb-4">
            開発者が知識を共有し、キャリアを成長させる場所です。
          </p>
          <div className="space-y-2">
            <Button className="w-full" asChild>
              <Link href="/create-account">アカウント作成</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">ログイン</Link>
            </Button>
          </div>
        </div>

        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              ホーム
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dev-plus">
              <span className="mr-2 text-blue-600 font-bold">++</span>
              DEV++
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/podcasts">
              <Radio className="mr-2 h-4 w-4" />
              ポッドキャスト
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/videos">
              <Video className="mr-2 h-4 w-4" />
              ビデオ
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/tags">
              <Tag className="mr-2 h-4 w-4" />
              タグ
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/help">
              <HelpCircle className="mr-2 h-4 w-4" />
              DEV ヘルプ
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/shop">
              <ShoppingBag className="mr-2 h-4 w-4" />
              フォーラムショップ
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/advertise">
              <Heart className="mr-2 h-4 w-4" />
              DEVで広告
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/challenges">
              <Trophy className="mr-2 h-4 w-4" />
              DEVチャレンジ
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/showcase">
              <Sparkles className="mr-2 h-4 w-4" />
              DEVショーケース
            </Link>
          </Button>
        </nav>

        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold">その他</h3>
          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/code-of-conduct">
                <Scale className="mr-2 h-4 w-4" />
                行動規範
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/privacy">
                <Shield className="mr-2 h-4 w-4" />
                プライバシーポリシー
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/terms">
                <Eye className="mr-2 h-4 w-4" />
                利用規約
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );

  if (inLayout) {
    return (
      <aside className={`hidden lg:block w-64 min-h-screen ${className}`}>
        <div className="sticky top-16 overflow-y-auto h-[calc(100vh-4rem)]">
          {content}
        </div>
      </aside>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="px-4 pt-4 border-b">
        <SheetTitle className="flex justify-between items-center mb-3">
          <span>DEV Community</span>
        </SheetTitle>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto">
        {content}
      </div>
    </div>
  );
}
