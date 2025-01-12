'use client'

import { MediaFile } from '@/types/api/media/types'
import { MediaGridView } from './MediaGridView'
import { MediaListView } from './MediaListView'
import { Loader2 } from 'lucide-react'
import { useMediaView } from '@/hooks/media/useMediaView'

// ファイル選択のアクションハンドラの型定義
type FileSelectActionHandler = (file: MediaFile) => void

// コンポーネントのプロパティ型定義
interface MediaViewProps {
  view: 'grid' | 'list'
  onFileSelectAction: FileSelectActionHandler
  refreshTrigger: number
}

export function MediaView({
  view,
  onFileSelectAction,
  refreshTrigger,
}: MediaViewProps) {
  const { files, containerRef, isFetching } = useMediaView(refreshTrigger)

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-6rem)] overflow-auto overscroll-contain"
      style={{
        willChange: 'transform',
        WebkitOverflowScrolling: 'touch',
        minHeight: '200px',
      }}
    >
      <div className="px-4 pb-40">
        {/* ビューモードに応じたレンダリング */}
        {view === 'grid' ? (
          <MediaGridView
            files={files}
            onFileSelectAction={onFileSelectAction}
          />
        ) : (
          <MediaListView
            files={files}
            onFileSelectAction={onFileSelectAction}
          />
        )}

        {/* データ取得中のローディング表示 */}
        {isFetching && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}
