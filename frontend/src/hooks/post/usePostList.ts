import { useState, useEffect, useCallback } from 'react'
import { PostWithCategoryId, PostListResponse } from '@/types/api/post/response'
import { postApi } from '@/lib/api'

export const usePostList = (rowsPerPage: number = 10) => {
  const [posts, setPosts] = useState<PostWithCategoryId[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const result: PostListResponse = await postApi.getPostList({
        cursorPostId: page === 1 ? undefined : nextCursor,
        pageSize: rowsPerPage,
      })

      // 表示用のデータを設定
      const displayPosts = result.posts.slice(0, rowsPerPage)
      setPosts(displayPosts)
      setTotalPages(result.totalPages)
      setHasNextPage(page < result.totalPages)

      // カーソルを設定 - 現在のページの最後の要素のIDをカーソルとして使用
      if (displayPosts.length > 0) {
        const nextPageStartId = displayPosts[displayPosts.length - 1].id
        setNextCursor(nextPageStartId)
      }
    } catch (error) {
      setError(error as Error)
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page, rowsPerPage])

  useEffect(() => {
    void fetchPosts()
  }, [page])

  return {
    posts,
    page,
    setPage,
    totalPages,
    hasNextPage,
    isLoading,
    error,
    refetch: fetchPosts,
  }
}
