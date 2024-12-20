import { useState, useEffect } from 'react'
import { PostWithCategoryId, PostListResponse } from '@/types/api/post/response'
import { postApi } from '@/lib/api'

export const usePostList = (rowsPerPage: number = 10) => {
  const [posts, setPosts] = useState<PostWithCategoryId[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageCursors, setPageCursors] = useState<{ [key: number]: string }>({})
  const [hasNextPage, setHasNextPage] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let currentCursor: string | undefined =
          page === 1 ? undefined : pageCursors[page - 1]

        const result: PostListResponse = await postApi.getPostList({
          cursorPostId: currentCursor,
          pageSize: rowsPerPage,
        })

        // 次のページが存在するかチェック（pageSize + 1件取得されている）
        setHasNextPage(result.posts.length > rowsPerPage)

        // 表示用のpostsは1件のみ（次ページチェック用の要素を除外）
        const displayPosts = result.posts.slice(0, rowsPerPage)
        setPosts(displayPosts)
        setTotalPages(result.totalPages)

        // 次のページのカーソルを保存（最後の要素のIDをカーソルとして使用）
        if (result.posts.length > rowsPerPage) {
          setPageCursors((prev) => ({
            ...prev,
            [page]: result.posts[rowsPerPage - 1].id,
          }))
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    void fetchPosts()
  }, [page, rowsPerPage])

  return {
    posts,
    page,
    setPage,
    totalPages,
    hasNextPage,
  }
}
