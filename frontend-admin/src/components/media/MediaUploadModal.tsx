'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

interface MediaUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MediaUploadModal({
  open,
  onOpenChange,
}: MediaUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // ここでファイルアップロードを処理
    const files = Array.from(e.dataTransfer.files)
    console.log('Dropped files:', files)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>新しいメディアファイルを追加</DialogTitle>
        </DialogHeader>
        <div
          className={`
            mt-4 p-8 border-2 border-dashed rounded-lg
            ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                ファイルをドロップしてアップロード
              </p>
              <p className="text-xs text-muted-foreground mt-1">または</p>
              <Input
                type="file"
                className="hidden"
                id="file-upload"
                multiple
                onChange={(e) => {
                  // ここでファイルアップロードを処理
                  const files = Array.from(e.target.files || [])
                  console.log('Selected files:', files)
                }}
              />
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                ファイルを選択
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              最大アップロードサイズ: 2 MB
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
