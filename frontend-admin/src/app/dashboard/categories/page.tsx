'use client'

import { AddCategoryButton } from '@/components/category/AddCategoryButton'
import { CategoryTable } from '@/components/category/CategoryTable'
import { useCategoryList } from '@/hooks/category/useCategoryList'
import { useCallback, useState, useEffect } from 'react'
import { ROUTES } from '@/config/routes'
import { useRouter } from 'next/navigation'
import { LanguageSelector } from '@/components/common/LanguageSelector'
import { Language } from '@/types/api/common/types'

export default function CategoryList() {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja')
  const { categories, isLoading, error, refetch } = useCategoryList()

  // 言語変更時にデータを再フェッチ
  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setCurrentLanguage(newLanguage)
  }, [])

  // useEffect to trigger refetch when language changes
  useEffect(() => {
    refetch()
  }, [currentLanguage, refetch])

  const handleCategoryEdit = (id: string) => {
    router.push(ROUTES.DASHBOARD.CATEGORIES.EDIT(id))
  }

  // 子コンポーネントへデータ再取得関数を渡す
  const handleCategoryDeleted = useCallback(async () => {
    await refetch()
  }, [refetch])

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="flex items-center gap-4 mb-4">
        <AddCategoryButton />
        <LanguageSelector
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </div>
      <CategoryTable
        categories={categories}
        onEdit={handleCategoryEdit}
        onDelete={handleCategoryDeleted}
        isLoading={isLoading}
        currentLanguage={currentLanguage}
      />
    </div>
  )
}
