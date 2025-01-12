'use client'

import { use, useState, useEffect } from 'react'
import { Button, Card, CardBody } from '@nextui-org/react'
import { ROUTES } from '@/config/routes'
import { PostForm } from '@/components/post/PostForm'
import {
  convertPostResponseToFormData,
  usePostDetail,
} from '@/hooks/post/usePostDetail'
import { Save } from 'lucide-react'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default function EditPostPage(props: Props) {
  const params = use(props.params)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { post, isLoading } = usePostDetail(params.id)
  const currentLanguage = useLanguageStore((state) => state.language)
  const [formKey, setFormKey] = useState(0)

  // 言語が変更されたら、formKeyをインクリメント
  useEffect(() => {
    setFormKey((prev) => prev + 1)
  }, [currentLanguage])

  if (isLoading) return <p>Loading...</p>
  if (!post) return null

  // 選択された言語に基づいてデータを変換
  const initialData = convertPostResponseToFormData(post)

  return (
    <Card className="w-full">
      <CardBody>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              form="post-form"
              color="primary"
              size={'md'}
              startContent={<Save size={20} />}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              {t(currentLanguage, 'common.edit')}
            </Button>
          </div>
        </div>
        <PostForm
          key={`${formKey}-${initialData.language}`}
          mode="update"
          redirectPath={ROUTES.DASHBOARD.POSTS.BASE}
          id="post-form"
          initialData={initialData}
          onSubmittingChange={setIsSubmitting}
        />
      </CardBody>
    </Card>
  )
}
