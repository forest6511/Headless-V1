'use client'
// https://react.dev/reference/react/use
import { use, useState } from 'react'

import { Button, Card, CardBody, Select, SelectItem } from '@nextui-org/react'
import { ROUTES } from '@/config/routes'
import { PostForm } from '@/components/post/PostForm'
import {
  convertPostResponseToFormData,
  usePostDetail,
} from '@/hooks/post/usePostDetail'
import { Save } from 'lucide-react'
import { Language, Languages } from '@/types/api/common/types'
import { LanguageSelector } from '@/components/common/LanguageSelector'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default function EditPostPage(props: Props) {
  const params = use(props.params)
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { post, isLoading } = usePostDetail(params.id)

  if (isLoading) return <p>Loading...</p>
  if (!post) return null

  // 選択された言語に基づいてデータを変換
  const initialData = convertPostResponseToFormData(post, currentLanguage)

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
              記事の保存
            </Button>
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
            />
          </div>
        </div>
        <PostForm
          key={currentLanguage}
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
