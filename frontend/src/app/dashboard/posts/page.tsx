'use client'

import { useRouter } from 'next/navigation'
import { usePostList } from '@/hooks/post/usePostList'
import { useCategoryList } from '@/hooks/category/useCategoryList'
import { PostTable } from '@/components/admin/post/PostTable'
import { ROUTES } from '@/config/routes'
import { AddPostButton } from '@/components/admin/post/AddPostButton'
import { useCallback } from 'react'

const ROWS_PER_PAGE = 10

export default function PostsPage() {
  const router = useRouter()

  // カテゴリー情報
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategoryList()

  // 記事情報
  const { posts, page, setPage, totalPages, refetch } =
    usePostList(ROWS_PER_PAGE)

  const handlePostEdit = (id: string) => {
    router.push(ROUTES.DASHBOARD.POSTS.EDIT(id))
  }

  const handlePostDeleted = useCallback(async () => {
    // 記事を削除後、同じページ内で記事リストを再取得
    await refetch()
  }, [refetch])

  if (categoriesError) {
    return <div>エラーが発生しました: {categoriesError.message}</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between mb-4">
        <AddPostButton />
      </div>
      <PostTable
        posts={posts}
        categories={categories}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={handlePostEdit}
        onDelete={handlePostDeleted}
      />
    </div>
  )
}
