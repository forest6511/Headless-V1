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
import { toast } from 'sonner'
import { ADMIN_API_ENDPOINTS } from '@/config/endpoints'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'

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
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
]

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
  const currentLanguage = useLanguageStore((state) => state.language)

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(t(currentLanguage, 'media.upload.error.size'))
      return false
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(t(currentLanguage, 'media.upload.error.format'))
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
      toast.success(t(currentLanguage, 'media.upload.success'))
      onUploadComplete?.()
      onOpenChangeAction(false)
    } catch (error) {
      setUploadState({ status: 'error', progress: 0 })
      toast.error(t(currentLanguage, 'media.upload.error.general'))
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
          <DialogTitle>{t(currentLanguage, 'media.upload.title')}</DialogTitle>
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
                  {t(currentLanguage, 'media.upload.uploading')}
                </p>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    {t(currentLanguage, 'media.upload.dropzone.text')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t(currentLanguage, 'media.upload.dropzone.or')}
                  </p>
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
                    {t(currentLanguage, 'media.upload.dropzone.button')}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t(currentLanguage, 'media.upload.maxSize')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(currentLanguage, 'media.upload.formats')}
                </p>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
