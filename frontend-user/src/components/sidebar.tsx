'use client'

import { Button } from '@nextui-org/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

// カテゴリーデータ
const categories = [
  {
    title: 'やってみた',
    items: [
      '家庭',
      'フード',
      'ライフスタイル',
      'ショッピング',
      '育児',
      '健康',
      '旅行・おでかけ',
      'ペット',
      'コラム・エッセイ',
      '美容',
      'ファッション',
      'DIY',
      '造形',
      '手芸',
      'アウトドア',
    ],
  },
  {
    title: 'まなび',
    items: [
      '教育',
      '読書',
      'デザイン',
      '人文学',
      'サイエンス',
      '資格A',
      '教育B',
      '読書B',
      'デザインB',
      '人文学B',
      'サイエンスB',
      '教育C',
      '読書C',
      'デザインC',
      '人文学C',
      'サイエンスC',
      '教育D',
      '読書D',
      'デザインD',
      '人文学D',
      'サイエンスD',
    ],
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* サイドバーのコンテナ */}
      <aside
        className={cn(
          'fixed md:sticky left-0',
          'h-screen md:h-[calc(100vh-4rem)]',
          'top-0 md:top-16',
          'w-64 bg-white md:bg-transparent',
          'z-50 md:z-0',
          'transition-transform duration-300',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* スクロール可能なコンテンツエリア */}
        <div className="h-full overflow-y-auto">
          {/* モバイル用の閉じるボタン */}
          <Button
            className="absolute top-3 right-3 md:hidden"
            isIconOnly
            variant="light"
            onPress={onClose}
          >
            <X />
          </Button>

          {/* カテゴリーリスト */}
          <div className="p-4 pt-16 md:pt-4 space-y-5">
            {categories.map((category) => (
              <div key={category.title}>
                <h3 className="text-base font-medium mb-1">{category.title}</h3>
                {category.items.length > 0 && (
                  <ul className="space-y-1">
                    {category.items.map((item) => (
                      <li key={item}>
                        <Button
                          className="w-full justify-start font-normal text-sm -my-1"
                          variant="light"
                          size="sm"
                        >
                          {item}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* モバイル用オーバーレイ */}
      <div
        className={cn(
          'fixed inset-0 bg-black/20 z-40 md:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
    </>
  )
}
