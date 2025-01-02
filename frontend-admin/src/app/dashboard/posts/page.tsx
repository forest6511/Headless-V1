'use client'

import { useRouter } from 'next/navigation'
import { usePostList } from '@/hooks/post/usePostList'
import { useCategoryList } from '@/hooks/category/useCategoryList'
import { PostTable } from '@/components/post/PostTable'
import { ROUTES } from '@/config/routes'
import { AddPostButton } from '@/components/post/AddPostButton'
import { useCallback, useState } from 'react'
import { Language, Languages } from '@/types/api/post/types'
import { Select, SelectItem } from '@nextui-org/react'

const ROWS_PER_PAGE = 10

export default function PostsPage() {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja')


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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <AddPostButton />
          <Select
            label="言語"
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value as Language)}
            className="w-32"
            defaultSelectedKeys={["ja"]}
          >
            {Languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </Select>
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
        currentLanguage={currentLanguage}
      />
    </div>
  )
}
