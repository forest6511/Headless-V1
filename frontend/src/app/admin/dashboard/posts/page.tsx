'use client'

import { useRouter } from 'next/navigation'
import { usePostList } from '@/hooks/post/usePostList'
import { useCategories } from '@/hooks/category/useCategories'
import { PostTable } from '@/components/admin/post/PostTable'
import { ROUTES } from '@/config/routes'
import { AddPostButton } from '@/components/admin/post/AddPostButton'

const ROWS_PER_PAGE = 10

export default function PostsPage() {
  const router = useRouter()
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories()
  const { posts, page, setPage, totalPages } = usePostList(ROWS_PER_PAGE)

  const handleEdit = (id: string) => {
    router.push(ROUTES.ADMIN.DASHBOARD.POSTS.EDIT(id))
  }

  const handleDelete = (id: string) => {
    if (confirm('本当に削除しますか？')) {
      console.log('削除:', id)
    }
  }

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
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
