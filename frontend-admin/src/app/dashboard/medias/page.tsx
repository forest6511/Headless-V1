'use client'
import { useState } from 'react'
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
import { MediaGrid } from '@/components/media/MediaGrid'
import { MediaUploadModal } from '@/components/media/MediaUploadModal'
import { MediaDetailModal } from '@/components/media/MediaDetailModal'

export default function Home() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="p-6 pt-0 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">メディアライブラリ</h1>
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-[rgb(0,111,238)] hover:bg-[rgb(0,91,218)] text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          新しいメディアファイルを追加
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
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        <Select defaultValue="date">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="並び替え" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">アップロード日</SelectItem>
            <SelectItem value="name">ファイル名</SelectItem>
            <SelectItem value="size">ファイルサイズ</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="メディアを検索"
          className="flex-grow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <MediaGrid view={view} onFileSelectAction={setSelectedFile} />

      <MediaUploadModal
        open={isUploadModalOpen}
        onOpenChangeAction={setIsUploadModalOpen}
      />

      <MediaDetailModal
        file={selectedFile}
        open={!!selectedFile}
        onOpenChange={(open) => !open && setSelectedFile(null)}
      />
    </div>
  )
}
