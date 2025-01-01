'use client'
import { useState, useEffect, useRef, useCallback, useMemo, type ReactElement } from 'react'
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
const SCROLL_THRESHOLD = 2200
const DEBOUNCE_DELAY = 25

export function MediaGrid({ view, onFileSelectAction }: MediaGridProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [currentCursor, setCurrentCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async () => {
    if (!hasMore || isFetching) return
    setIsFetching(true)

    try {
      const params = new URLSearchParams({
        ...(currentCursor && { cursorMediaId: currentCursor }),
        pageSize: String(ITEMS_PER_PAGE)
      })

      const response = await fetch(
        `${ADMIN_API_ENDPOINTS.MEDIA.SWR}?${params}`,
        { priority: 'high' }
      )
      const data = await response.json()

      if (!data.media?.length) {
        setHasMore(false)
        return
      }

      setFiles(prevFiles => {
        const uniqueFiles = [...prevFiles]
        data.media.forEach((newFile: MediaFile) => {
          if (!uniqueFiles.some(file => file.id === newFile.id)) {
            uniqueFiles.push(newFile)
          }
        })
        return uniqueFiles
      })

      if (data.media.length < ITEMS_PER_PAGE) {
        setHasMore(false)
      } else {
        setCurrentCursor(data.media[data.media.length - 1].id)
      }
    } catch (error) {
      console.error('Error fetching media:', error)
      setHasMore(false)
    } finally {
      setIsFetching(false)
    }
  }, [currentCursor, hasMore, isFetching])

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container || !hasMore || isFetching) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const threshold = scrollHeight - scrollTop - clientHeight

    if (threshold < SCROLL_THRESHOLD) {
      void fetchData()
    }
  }, [fetchData, hasMore, isFetching])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let timeoutId: number

    const debouncedScroll = () => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(handleScroll, DEBOUNCE_DELAY)
    }

    container.addEventListener('scroll', debouncedScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', debouncedScroll)
      window.clearTimeout(timeoutId)
    }
  }, [handleScroll])

  useEffect(() => {
    void fetchData()
  }, [])

  useEffect(() => {
    return () => {
      setFiles([])
      setCurrentCursor(null)
      setHasMore(true)
      setIsFetching(false)
    }
  }, [])

  const formatFileSize = useCallback((size: number): string => {
    if (!size || size === 0) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    const base = 1024
    const exponent = Math.floor(Math.log(size) / Math.log(base))
    const value = size / Math.pow(base, exponent)
    return `${value.toFixed(2)} ${units[exponent]}`
  }, [])

  const renderGridView = useMemo(() => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-16">
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
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-sm truncate">
              {file.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  ), [files, onFileSelectAction])

  const renderListView = useMemo(() => (
    <div className="mb-16">
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
                  decoding="async"
                  fetchPriority="low"
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
    </div>
  ), [files, onFileSelectAction, formatFileSize])

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-6rem)] overflow-auto overscroll-contain"
      style={{
        willChange: 'transform',
        WebkitOverflowScrolling: 'touch',
        minHeight: '200px'
      }}
    >
      <div className="px-4 pb-40">
        {view === 'grid' ? renderGridView : renderListView}
        {isFetching && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}

