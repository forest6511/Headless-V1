'use client'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MediaFile } from '@/types/api/media/types'
import { Copy } from 'lucide-react'

interface MediaDetailModalProps {
  file: MediaFile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MediaDetailModal({
  file,
  open,
  onOpenChange,
}: MediaDetailModalProps) {
  if (!file) return null

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-sm font-medium">サムネイル</p>
                <img
                  src={file.thumbnailUrl}
                  alt="サムネイル"
                  width={100}
                  height={100}
                  className="object-cover rounded mt-1"
                />
              </div>
              <div>
                <p className="text-sm font-medium">小サイズ</p>
                <img
                  src={file.smallUrl}
                  alt="小サイズ"
                  width={100}
                  height={100}
                  className="object-cover rounded mt-1"
                />
              </div>
              <div>
                <p className="text-sm font-medium">中サイズ</p>
                <img
                  src={file.mediumUrl}
                  alt="中サイズ"
                  width={100}
                  height={100}
                  className="object-cover rounded mt-1"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                作成日: {new Date(file.createdAt).toLocaleDateString('ja-JP')}
              </p>
              <p className="text-sm text-muted-foreground">
                アップロード: {file.uploadedBy}
              </p>
              <p className="text-sm text-muted-foreground">
                サムネイルサイズ: {formatFileSize(file.thumbnailSize)}
              </p>
              <p className="text-sm text-muted-foreground">
                小サイズ: {formatFileSize(file.smallSize)}
              </p>
              <p className="text-sm text-muted-foreground">
                中サイズ: {formatFileSize(file.mediumSize)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">タイトル</label>
              <Input defaultValue={file.title} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">代替テキスト</label>
              <Textarea defaultValue={file.altText} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">サムネイルURL</label>
              <div className="flex gap-2">
                <Input value={file.thumbnailUrl} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyUrl(file.thumbnailUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">小サイズURL</label>
              <div className="flex gap-2">
                <Input value={file.smallUrl} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyUrl(file.smallUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">中サイズURL</label>
              <div className="flex gap-2">
                <Input value={file.mediumUrl} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyUrl(file.mediumUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="destructive">完全に削除する</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
