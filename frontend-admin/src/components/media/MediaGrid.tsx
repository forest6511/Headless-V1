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
import { ADMIN_API_ENDPOINTS } from '@/config/endpoints'

type FileSelectActionHandler = (file: MediaFile) => void

interface MediaGridProps {
  view: 'grid' | 'list'
  onFileSelectAction: FileSelectActionHandler
}

const ITEMS_PER_PAGE = 20
const SCROLL_THRESHOLD = 100

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function MediaGrid({ view, onFileSelectAction }: MediaGridProps) {
  const [page, setPage] = useState(1)
  const [files, setFiles] = useState<MediaFile[]>([])
  const [hasMore, setHasMore] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastScrollPosition = useRef<number>(0)

  // コンポーネントのマウント時にstateをリセット
  useEffect(() => {
    return () => {
      setFiles([])
      setPage(1)
      setHasMore(true)
      lastScrollPosition.current = 0
    }
  }, [])

  const { data, error, isLoading } = useSWR(
    hasMore
      ? `${ADMIN_API_ENDPOINTS.MEDIA.SWR}?page=${page}&limit=${ITEMS_PER_PAGE}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
      revalidateOnMount: true,
      shouldRetryOnError: false,
    }
  )

  const formatFileSize = (size: number): string => {
    if (!size || size === 0) return '0 B'

    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    const base = 1024
    const decimalPlaces = 2

    const exponent = Math.floor(Math.log(size) / Math.log(base))
    const value = size / Math.pow(base, exponent)
    const unit = units[exponent]

    return `${value.toFixed(decimalPlaces)} ${unit}`
  }

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setFiles((prevFiles) => {
        const uniqueFiles = new Map(prevFiles.map((file) => [file.id, file]))
        data.forEach((newFile) => {
          uniqueFiles.set(newFile.id, newFile)
        })
        return Array.from(uniqueFiles.values())
      })

      if (data.length < ITEMS_PER_PAGE) {
        setHasMore(false)
      }
    }
  }, [data])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const currentPosition = scrollTop

      if (currentPosition > lastScrollPosition.current) {
        if (scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD) {
          if (!isLoading && hasMore) {
            setPage((prev) => prev + 1)
          }
        }
      }

      lastScrollPosition.current = currentPosition
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [isLoading, hasMore])

  const GridView = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="relative aspect-square group cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onFileSelectAction(file)}
        >
          <img
            src={file.thumbnailUrl}
            alt={file.title || ''}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
            loading="lazy"
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
          <TableHead>タイトル</TableHead>
          <TableHead>アップロード日</TableHead>
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
            onClick={() => onFileSelectAction(file)}
          >
            <TableCell>
              <img
                src={file.thumbnailUrl}
                alt={file.title || ''}
                width={50}
                height={50}
                className="object-cover rounded"
                loading="lazy"
              />
            </TableCell>
            <TableCell>{file.title}</TableCell>
            <TableCell>
              {new Date(file.createdAt).toLocaleDateString('ja-JP')}
            </TableCell>
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
    <div ref={containerRef} className="space-y-4 h-[80vh] overflow-auto">
      {view === 'grid' ? <GridView /> : <ListView />}
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}
    </div>
  )
}
