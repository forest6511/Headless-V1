'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import { Button as NextUiButton } from '@nextui-org/react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MediaFile } from '@/types/api/media/types'
import { Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'

interface MediaDetailModalProps {
  file: MediaFile | null
  open: boolean
  onOpenChangeAction: (open: boolean) => void
}

export function MediaDetailModal({
  file,
  open,
  onOpenChangeAction,
}: MediaDetailModalProps) {
  const currentLanguage = useLanguageStore((state) => state.language)

  if (!file) return null

  const handleCopyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url)
    toast.success(t(currentLanguage, 'media.detail.copySuccess'), {
      duration: 3000,
      position: 'bottom-right',
    })
  }

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="max-w-6xl">
        <DialogTitle>
          <VisuallyHidden>
            {t(currentLanguage, 'media.detail.title')}
          </VisuallyHidden>
        </DialogTitle>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-sm font-medium">
                  {t(currentLanguage, 'media.detail.thumbnail')}
                </p>
                <img
                  src={file.thumbnailUrl}
                  alt={t(currentLanguage, 'media.detail.thumbnail')}
                  width={100}
                  height={100}
                  className="object-cover rounded mt-1"
                />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {t(currentLanguage, 'media.detail.small')}
                </p>
                <img
                  src={file.smallUrl}
                  alt={t(currentLanguage, 'media.detail.small')}
                  width={100}
                  height={100}
                  className="object-cover rounded mt-1"
                />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {t(currentLanguage, 'media.detail.medium')}
                </p>
                <img
                  src={file.mediumUrl}
                  alt={t(currentLanguage, 'media.detail.medium')}
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
                {t(currentLanguage, 'media.detail.createdAt')}:{' '}
                {new Date(file.createdAt).toLocaleDateString(currentLanguage)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(currentLanguage, 'media.detail.uploadedBy')}:{' '}
                {file.uploadedBy}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(currentLanguage, 'media.detail.thumbnailSize')}:{' '}
                {formatFileSize(file.thumbnailSize)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(currentLanguage, 'media.detail.smallSize')}:{' '}
                {formatFileSize(file.smallSize)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(currentLanguage, 'media.detail.mediumSize')}:{' '}
                {formatFileSize(file.mediumSize)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t(currentLanguage, 'media.detail.fileTitle')}
              </label>
              <Input defaultValue={file.title} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t(currentLanguage, 'media.detail.altText')}
              </label>
              <Textarea defaultValue={file.altText} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t(currentLanguage, 'media.detail.thumbnailUrl')}
              </label>
              <div className="flex gap-2">
                <Input
                  value={file.thumbnailUrl}
                  readOnly
                  className="bg-gray-100"
                />
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
              <label className="text-sm font-medium">
                {t(currentLanguage, 'media.detail.smallUrl')}
              </label>
              <div className="flex gap-2">
                <Input value={file.smallUrl} readOnly className="bg-gray-100" />
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
              <label className="text-sm font-medium">
                {t(currentLanguage, 'media.detail.mediumUrl')}
              </label>
              <div className="flex gap-2">
                <Input
                  value={file.mediumUrl}
                  readOnly
                  className="bg-gray-100"
                />
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
              <NextUiButton color="primary">
                {t(currentLanguage, 'media.detail.update')}
              </NextUiButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
