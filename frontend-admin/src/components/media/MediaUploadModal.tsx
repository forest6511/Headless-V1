'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Upload, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api/core/client'
// npx shadcn@latest add sonner
import { toast } from 'sonner'
import { ADMIN_API_ENDPOINTS } from '@/config/endpoints'

interface MediaUploadModalProps {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onUploadComplete?: () => void
}

interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error'
  progress: number
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic']

export function MediaUploadModal({
  open,
  onOpenChangeAction,
  onUploadComplete,
}: MediaUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
  })

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error('ファイルサイズが10MBを超えています')
      return false
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('対応していないファイル形式です')
      return false
    }
    return true
  }

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(validateFile)
    if (validFiles.length === 0) return

    setUploadState({ status: 'uploading', progress: 0 })

    try {
      for (const file of validFiles) {
        await apiClient.uploadFile(ADMIN_API_ENDPOINTS.MEDIA.POST, file)
      }

      setUploadState({ status: 'success', progress: 100 })
      toast.success('アップロードが完了しました')
      onUploadComplete?.()
      onOpenChangeAction(false)
    } catch (error) {
      setUploadState({ status: 'error', progress: 0 })
      toast.error('アップロードに失敗しました')
    }
  }

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
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>新しいメディアファイルを追加</DialogTitle>
        </DialogHeader>
        <div
          className={`
            mt-4 p-8 border-2 border-dashed rounded-lg
            ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
            ${uploadState.status === 'uploading' ? 'pointer-events-none' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            {uploadState.status === 'uploading' ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">
                  アップロード中...
                </p>
              </div>
            ) : (
              <>
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
                    accept={ALLOWED_TYPES.join(',')}
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      handleFiles(files)
                    }}
                  />
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() =>
                      document.getElementById('file-upload')?.click()
                    }
                  >
                    ファイルを選択
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  最大アップロードサイズ: 10 MB
                </p>
                <p className="text-xs text-muted-foreground">
                  対応形式: JPG, PNG, GIF, WebP
                </p>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
