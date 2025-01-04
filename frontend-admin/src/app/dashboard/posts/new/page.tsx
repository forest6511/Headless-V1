'use client'

import { useRef, useState } from 'react'
import { Button, Card, CardBody } from '@nextui-org/react'
import { PostForm } from '@/components/post/PostForm'
import { ROUTES } from '@/config/routes'
import { Save } from 'lucide-react'
import { Language } from '@/types/api/post/types'
import { Loading } from '@/components/ui/loading'

export default function NewPostPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja')
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <>
      <Loading isLoading={isSubmitting} />
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
              日本語で入力してください
            </div>
          </div>
          <PostForm
            key={currentLanguage}
            mode="create"
            redirectPath={ROUTES.DASHBOARD.POSTS.BASE}
            id="post-form"
            onSubmittingChange={setIsSubmitting}
            initialData={{
              language: currentLanguage,
              title: '',
              content: '',
              status: 'DRAFT',
              categoryId: '01939280-7ccb-72a8-9257-7ba44de715b6',
            }}
          />
        </CardBody>
      </Card>
    </>
  )
}
