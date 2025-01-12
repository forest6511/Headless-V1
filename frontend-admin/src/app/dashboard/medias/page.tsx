'use client'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Grid2X2, List, Upload } from 'lucide-react'
import { MediaFile } from '@/types/api/media/types'
import { MediaView } from '@/components/media/MediaView'
import { MediaUploadModal } from '@/components/media/MediaUploadModal'
import { MediaDetailModal } from '@/components/media/MediaDetailModal'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'

export default function MediaPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const currentLanguage = useLanguageStore((state) => state.language)

  const handleUploadComplete = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  return (
    <div className="p-6 pt-0 w-full">
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-[rgb(0,111,238)] hover:bg-[rgb(0,91,218)] text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          {t(currentLanguage, 'media.addNew')}
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setView('grid')}
            className={
              view === 'grid'
                ? 'bg-[rgb(0,111,238)] hover:bg-[rgb(0,91,218)] text-white'
                : ''
            }
            title={t(currentLanguage, 'media.view.grid')}
          >
            <Grid2X2 className="w-4 h-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setView('list')}
            className={
              view === 'list'
                ? 'bg-[rgb(0,111,238)] hover:bg-[rgb(0,91,218)] text-white'
                : ''
            }
            title={t(currentLanguage, 'media.view.list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        <Select defaultValue="date">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t(currentLanguage, 'media.sort.label')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">
              {t(currentLanguage, 'media.sort.uploadDate')}
            </SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder={t(currentLanguage, 'media.search')}
          className="flex-grow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <MediaView
        view={view}
        onFileSelectAction={setSelectedFile}
        refreshTrigger={refreshTrigger}
      />

      <MediaUploadModal
        open={isUploadModalOpen}
        onOpenChangeAction={setIsUploadModalOpen}
        onUploadComplete={handleUploadComplete}
      />

      <MediaDetailModal
        file={selectedFile}
        open={!!selectedFile}
        onOpenChangeAction={(open) => !open && setSelectedFile(null)}
      />
    </div>
  )
}
