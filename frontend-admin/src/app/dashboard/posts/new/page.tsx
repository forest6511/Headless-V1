'use client'

import { useState } from 'react'
import { Button, Card, CardBody } from '@nextui-org/react'
import { PostForm } from '@/components/post/PostForm'
import { ROUTES } from '@/config/routes'
import { Save } from 'lucide-react'
import { Loading } from '@/components/ui/loading'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'

export default function NewPostPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const currentLanguage = useLanguageStore((state) => state.language)

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
                {t(currentLanguage, 'common.addNew')}
              </Button>
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
              featuredImageId: '',
            }}
          />
        </CardBody>
      </Card>
    </>
  )
}
