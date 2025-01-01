import { useState, useEffect, useRef, useCallback } from 'react'
import { MediaFile } from '@/types/api/media/types'
import { ADMIN_API_ENDPOINTS } from '@/config/endpoints'
import { MEDIA_GRID_CONFIG } from '@/config/constants'

export function useMediaView() {
  // メディアファイルの状態管理用のステート
  const [files, setFiles] = useState<MediaFile[]>([])
  const [currentCursor, setCurrentCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // メディアデータを非同期で取得するメソッド
  const fetchData = useCallback(async () => {
    // データ取得の重複防止とページネーション制御
    if (!hasMore || isFetching) return
    setIsFetching(true)

    try {
      // APIエンドポイントへのクエリパラメータ準備
      const params = new URLSearchParams({
        ...(currentCursor && { cursorMediaId: currentCursor }),
        pageSize: String(MEDIA_GRID_CONFIG.ITEMS_PER_PAGE),
      })

      // メディアデータのフェッチ
      const response = await fetch(
        `${ADMIN_API_ENDPOINTS.MEDIA.SWR}?${params}`,
        { priority: 'high' }
      )
      const data = await response.json()

      // データがない場合の処理
      if (!data.media?.length) {
        setHasMore(false)
        return
      }

      // 重複を避けながらファイルリストを更新
      setFiles((prevFiles) => {
        const uniqueFiles = [...prevFiles]
        data.media.forEach((newFile: MediaFile) => {
          if (!uniqueFiles.some((file) => file.id === newFile.id)) {
            uniqueFiles.push(newFile)
          }
        })
        return uniqueFiles
      })

      // ページネーション制御
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
  }, [currentCursor, hasMore, isFetching])

  // スクロール時の追加データ読み込みハンドラ
  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container || !hasMore || isFetching) return

    // スクロール位置に基づくデータ読み込みの判定
    const { scrollTop, scrollHeight, clientHeight } = container
    const threshold = scrollHeight - scrollTop - clientHeight

    if (threshold < MEDIA_GRID_CONFIG.SCROLL_THRESHOLD) {
      void fetchData()
    }
  }, [fetchData, hasMore, isFetching])

  // スクロールイベントのセットアップとクリーンアップ
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let timeoutId: number

    // デバウンス処理を適用したスクロールイベント
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

  // 初回データ取得
  useEffect(() => {
    void fetchData()
  }, [])

  // コンポーネントのクリーンアップ
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
