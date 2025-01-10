'use client'
import { use, useState, useEffect } from 'react'

import { Card, CardBody } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useCategoryStore } from '@/stores/admin/categoryStore'
import { ROUTES } from '@/config/routes'
import { LanguageSelector } from '@/components/common/LanguageSelector'
import { Language } from '@/types/api/common/types'
import { UpdateCategoryData } from '@/schemas/category'
import { UpdateCategoryForm } from '@/components/category/UpdateCategoryForm'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default function EditCategoryPage({ params }: Props) {
  const router = useRouter()
  const categories = useCategoryStore((state) => state.categories)
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja')
  const [category, setCategory] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Unwrap params using use()
  const resolvedParams = use(params)

  useEffect(() => {
    // Find category when component mounts or categories change
    const foundCategory = categories.find((t) => t.id === resolvedParams.id)

    if (foundCategory) {
      setCategory(foundCategory)
      setIsLoading(false)
    } else {
      // Redirect if category not found
      router.push(ROUTES.DASHBOARD.CATEGORIES.BASE)
    }
  }, [resolvedParams.id, categories, router])

  // Wait while loading
  if (isLoading) {
    return <div>Loading...</div>
  }

  // Find the translation for the current language
  const categoryTranslation = category.translations.find(
    (t: any) => t.language === currentLanguage
  )

  const defaultValues = {
    id: resolvedParams.id,
    name: categoryTranslation?.name || category.name,
    slug: category.slug,
    description: categoryTranslation?.description || '',
    parentId: category.parentId || '',
    language: currentLanguage,
  } as UpdateCategoryData

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language)
  }

  return (
    <Card className="w-full">
      <CardBody>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">カテゴリーの編集</h1>
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </div>
        <UpdateCategoryForm
          key={currentLanguage}
          redirectPath={ROUTES.DASHBOARD.CATEGORIES.BASE}
          initialData={defaultValues}
        />
      </CardBody>
    </Card>
  )
}
