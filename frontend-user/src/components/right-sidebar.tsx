import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function RightSidebar() {
  return (
    <aside className="w-full lg:w-80 px-0 sm:px-4 lg:pl-4">
      <div className="sticky top-16 pt-0 lg:pt-4">
        <div className="border-y sm:border sm:rounded-lg bg-background mb-3 sm:mb-4">
          <div className="p-4">
            <h2 className="text-base font-semibold mb-4">👋 今週の出来事</h2>
            <div className="space-y-4">
              <Link href="/challenge" className="block">
                <img
                  src="/placeholder.svg?height=150&width=300"
                  alt="フロントエンドチャレンジ"
                  className="rounded-lg mb-2"
                />
                <h3 className="font-medium text-sm">フロントエンドチャレンジ: 12月編</h3>
                <p className="text-sm text-muted-foreground">提出期限: 12月29日</p>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-y sm:border sm:rounded-lg bg-background mb-3 sm:mb-4">
          <div className="p-4">
            <h2 className="text-base font-semibold mb-4">チャレンジ 🎯</h2>
            <div className="space-y-2">
              <div>
                <p className="font-medium mb-1">$3,000の賞金 💰</p>
                <img
                  src="/placeholder.svg?height=150&width=300"
                  alt="Bright Data Web Scraping Challenge"
                  className="rounded-lg mb-2"
                />
                <Link href="/challenge/bright-data" className="text-sm hover:text-blue-600">
                  Bright Data Web Scraping Challenge
                </Link>
                <p className="text-sm text-muted-foreground">提出期限: 12月29日</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-y sm:border sm:rounded-lg bg-background mb-3 sm:mb-4">
          <div className="p-4">
            <h2 className="text-base font-semibold mb-4">#discuss</h2>
            <p className="text-sm text-muted-foreground mb-4">
              コミュニティ全体を対象としたディスカッションスレッド
            </p>
            <div className="space-y-4">
              <Link href="/discuss/new" className="block group">
                <div className="flex items-start space-x-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium group-hover:text-blue-600">
                      今年はどんな年でしたか？
                    </h3>
                    <Badge variant="secondary">New</Badge>
                  </div>
                </div>
              </Link>
              <Link href="/discuss/career" className="block group">
                <div className="flex items-start space-x-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium group-hover:text-blue-600">
                      テックキャリアを加速させた方法
                    </h3>
                    <p className="text-xs text-muted-foreground">8 コメント</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground px-4">
          良い一週間を！ ❤️
        </div>
      </div>
    </aside>
  )
}

