import { useState, useEffect, useRef, useCallback } from 'react'
import { MediaFile } from '@/types/api/media/types'
import { ADMIN_API_ENDPOINTS } from '@/config/endpoints'
import { MEDIA_GRID_CONFIG } from '@/config/constants'

export function useMediaView(refreshTrigger: number = 0) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [currentCursor, setCurrentCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(
    async (isRefresh: boolean = false) => {
      if ((!hasMore && !isRefresh) || isFetching) return
      setIsFetching(true)

      try {
        const params = new URLSearchParams({
          ...(currentCursor && !isRefresh && { cursorMediaId: currentCursor }),
          pageSize: String(MEDIA_GRID_CONFIG.ITEMS_PER_PAGE),
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

        setFiles((prevFiles) => {
          if (isRefresh) return data.media
          const uniqueFiles = [...prevFiles]
          data.media.forEach((newFile: MediaFile) => {
            if (!uniqueFiles.some((file) => file.id === newFile.id)) {
              uniqueFiles.push(newFile)
            }
          })
          return uniqueFiles
        })

        if (data.media.length < MEDIA_GRID_CONFIG.ITEMS_PER_PAGE) {
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
    },
    [currentCursor, hasMore, isFetching]
  )

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container || !hasMore || isFetching) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const threshold = scrollHeight - scrollTop - clientHeight

    if (threshold < MEDIA_GRID_CONFIG.SCROLL_THRESHOLD) {
      void fetchData()
    }
  }, [fetchData, hasMore, isFetching])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let timeoutId: number

    const debouncedScroll = () => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(
        handleScroll,
        MEDIA_GRID_CONFIG.DEBOUNCE_DELAY
      )
    }

    container.addEventListener('scroll', debouncedScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', debouncedScroll)
      window.clearTimeout(timeoutId)
    }
  }, [handleScroll])

  useEffect(() => {
    setFiles([])
    setCurrentCursor(null)
    setHasMore(true)
    void fetchData(true)
  }, [refreshTrigger])

  useEffect(() => {
    return () => {
      setFiles([])
      setCurrentCursor(null)
      setHasMore(true)
      setIsFetching(false)
    }
  }, [])

  return {
    files,
    containerRef,
    isFetching,
    fetchData,
  }
}
