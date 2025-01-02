import { useState, useEffect, useCallback } from 'react'
import { PostResponse, PostListResponse } from '@/types/api/post/response'
import { postApi } from '@/lib/api'

export const usePostList = (rowsPerPage: number = 10) => {
  const [posts, setPosts] = useState<PostResponse[]>([])
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

      setPosts(result.posts)
      setTotalPages(result.totalPages)
      setHasNextPage(page < result.totalPages)

      if (result.posts.length > 0) {
        const nextPageStartId = result.posts[result.posts.length - 1].id
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
