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
import { createMediaUploadSchema, MediaUploadData } from '@/schemas/media'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface MediaUploadModalProps {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onUploadComplete?: () => void
}

const UploadStatus = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const

type UploadStatusType = (typeof UploadStatus)[keyof typeof UploadStatus]

interface UploadState {
  status: UploadStatusType
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
  const currentLanguage = useLanguageStore((state) => state.language)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>({
    status: UploadStatus.IDLE,
    progress: 0,
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<MediaUploadData>({
    resolver: zodResolver(createMediaUploadSchema(currentLanguage)),
    defaultValues: {
      language: currentLanguage,
      title: '',
    },
  })

  const title = watch('title')

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

  const handleFiles = async (files: File[], formData: MediaUploadData) => {
    const validFiles = files.filter(validateFile)
    if (validFiles.length === 0) return

    setUploadState({ status: UploadStatus.UPLOADING, progress: 0 })

    try {
      for (const file of validFiles) {
        await apiClient.uploadFile(
          ADMIN_API_ENDPOINTS.MEDIA.POST,
          file,
          formData
        )
      }

      setUploadState({ status: UploadStatus.SUCCESS, progress: 100 })
      toast.success(t(currentLanguage, 'media.upload.success'))
      onUploadComplete?.()
      onOpenChangeAction(false)
      reset({ language: currentLanguage, title: '' })
    } catch (error) {
      setUploadState({ status: UploadStatus.ERROR, progress: 0 })
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    await handleSubmit((data) => handleFiles(files, data))()
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    await handleSubmit((data) => handleFiles(files, data))()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t(currentLanguage, 'media.upload.title')}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              {t(currentLanguage, 'media.upload.titleLabel')}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="title"
              className={`w-full border rounded-md px-3 py-2 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              {...register('title')}
              placeholder={t(currentLanguage, 'media.upload.titlePlaceholder')}
              disabled={uploadState.status === UploadStatus.UPLOADING}
              maxLength={50}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {title?.length || 0}/50
            </p>
          </div>

          <div
            className={`
              p-8 border-2 border-dashed rounded-lg
              ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
              ${uploadState.status === UploadStatus.UPLOADING ? 'pointer-events-none' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              {uploadState.status === UploadStatus.UPLOADING ? (
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
                      onChange={handleFileInput}
                    />
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() =>
                        document.getElementById('file-upload')?.click()
                      }
                      disabled={
                        uploadState.status === ('uploading' as UploadStatusType)
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
        </form>
      </DialogContent>
    </Dialog>
  )
}
