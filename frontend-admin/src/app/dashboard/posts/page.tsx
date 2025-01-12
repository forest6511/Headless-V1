'use client'

import { useRouter } from 'next/navigation'
import { usePostList } from '@/hooks/post/usePostList'
import { useCategoryList } from '@/hooks/category/useCategoryList'
import { PostTable } from '@/components/post/PostTable'
import { ROUTES } from '@/config/routes'
import { AddPostButton } from '@/components/post/AddPostButton'
import { useCallback } from 'react'
import { useLanguageStore } from '@/stores/admin/languageStore'

const ROWS_PER_PAGE = 10

export default function PostsPage() {
  const router = useRouter()
  const language = useLanguageStore((state) => state.language)

  // カテゴリー情報
  const { categories } = useCategoryList()

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

  return (
    <div className="container mx-auto p-2 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <AddPostButton />
        </div>
      </div>
      <PostTable
        posts={posts}
        categories={categories}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={handlePostEdit}
        onDelete={handlePostDeleted}
        currentLanguage={language}
      />
    </div>
  )
}
