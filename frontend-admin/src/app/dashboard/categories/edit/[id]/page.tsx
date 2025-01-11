'use client'
import { use, useState, useEffect } from 'react'
import { Button, Card, CardBody } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useCategoryStore } from '@/stores/admin/categoryStore'
import { ROUTES } from '@/config/routes'
import { LanguageSelector } from '@/components/common/LanguageSelector'
import { Language } from '@/types/api/common/types'
import { UpdateCategoryData } from '@/schemas/category'
import { UpdateCategoryForm } from '@/components/category/UpdateCategoryForm'
import { Save } from 'lucide-react'
import { Loading } from '@/components/ui/loading'

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const resolvedParams = use(params)

  useEffect(() => {
    const foundCategory = categories.find((t) => t.id === resolvedParams.id)

    if (foundCategory) {
      setCategory(foundCategory)
      setIsLoading(false)
    } else {
      router.push(ROUTES.DASHBOARD.CATEGORIES.BASE)
    }
  }, [resolvedParams.id, categories, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const categoryTranslation = category.translations.find(
    (t: any) => t.language === currentLanguage
  )

  const defaultValues = {
    id: resolvedParams.id,
    name: categoryTranslation?.name || category.name,
    slug: category.slug,
    description: categoryTranslation?.description || '',
    parentId: category.parentId || '',
    language: currentLanguage, // 現在の言語を設定
  } as UpdateCategoryData

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language)
    setFormKey((prev) => prev + 1) // フォームを強制的に再レンダリング
  }

  return (
    <>
      <Loading isLoading={isSubmitting} />
      <Card className="w-full">
        <CardBody>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                form="category-form"
                color="primary"
                size="md"
                startContent={<Save size={20} />}
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              >
                カテゴリーを更新
              </Button>
              <LanguageSelector
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
              />
            </div>
          </div>
          <UpdateCategoryForm
            key={formKey} // キーを変更してフォームを再マウント
            id="category-form"
            redirectPath={ROUTES.DASHBOARD.CATEGORIES.BASE}
            initialData={defaultValues}
            onSubmittingChange={setIsSubmitting}
          />
        </CardBody>
      </Card>
    </>
  )
}
