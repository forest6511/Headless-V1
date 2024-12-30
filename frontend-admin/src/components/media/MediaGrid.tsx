'use client'
import { useState, useEffect, useRef } from 'react'
import useSWR from 'swr'
import { MediaFile } from '@/types/api/media/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2 } from 'lucide-react'

interface MediaGridProps {
  view: 'grid' | 'list'
  onFileSelect: (file: MediaFile) => void
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function MediaGrid({ view, onFileSelect }: MediaGridProps) {
  const [page, setPage] = useState(1)
  const [files, setFiles] = useState<MediaFile[]>([])
  const loadMoreRef = useRef(null)

  const { data, error, isLoading } = useSWR(
    `/api/admin/medias?page=${page}&limit=20`,
    fetcher
  )

  useEffect(() => {
    if (data) {
      setFiles((prevFiles) => [...prevFiles, ...data])
    }
  }, [data])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && data?.length > 0) {
          setPage((prevPage) => prevPage + 1)
        }
      },
      { threshold: 1.0 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [isLoading, data])

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }

  const GridView = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="relative aspect-square group cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onFileSelect(file)}
        >
          <img
            src={file.thumbnailUrl}
            alt={file.title || ''}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-sm truncate">
              {file.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const ListView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>サムネイル</TableHead>
          <TableHead>ファイル名</TableHead>
          <TableHead>タイトル</TableHead>
          <TableHead>アップロード日</TableHead>
          <TableHead>オリジナルサイズ</TableHead>
          <TableHead>サムネイルサイズ</TableHead>
          <TableHead>小サイズ</TableHead>
          <TableHead>中サイズ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow
            key={file.id}
            className="cursor-pointer hover:bg-muted"
            onClick={() => onFileSelect(file)}
          >
            <TableCell>
              <img
                src={file.thumbnailUrl}
                alt={file.title || ''}
                width={50}
                height={50}
                className="object-cover rounded"
              />
            </TableCell>
            <TableCell>{file.filePath}</TableCell>
            <TableCell>{file.title}</TableCell>
            <TableCell>
              {new Date(file.uploadedAt).toLocaleDateString('ja-JP')}
            </TableCell>
            <TableCell>{formatFileSize(file.originalSize)}</TableCell>
            <TableCell>{formatFileSize(file.thumbnailSize)}</TableCell>
            <TableCell>{formatFileSize(file.smallSize)}</TableCell>
            <TableCell>{formatFileSize(file.mediumSize)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  if (error) return <div>エラーが発生しました</div>

  return (
    <div className="space-y-4">
      {view === 'grid' ? <GridView /> : <ListView />}
      <div ref={loadMoreRef} className="flex justify-center items-center py-4">
        {isLoading && <Loader2 className="w-6 h-6 animate-spin" />}
      </div>
    </div>
  )
}
