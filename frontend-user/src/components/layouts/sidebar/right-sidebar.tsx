import Link from 'next/link'
export function RightSidebar() {
  return (
    <aside className="w-full lg:w-80 px-0 sm:px-4 lg:pl-0">
      <div className="sticky top-16 pt-0 lg:pt-4">
        <div className="border-y sm:border sm:rounded-md bg-background mb-3 sm:mb-4">
          <div className="p-4">
            <div className="text-base font-semibold mb-4">👋 テスト</div>
            <div className="space-y-4">
              <Link href="/challenge" className="block">
                <h3 className="font-medium text-sm">チャレンジ: 12月編</h3>
                <p className="text-sm text-muted-foreground">
                  提出期限: 12月29日
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
