'use client'

import { useState } from 'react'
import { Button, Card, CardBody } from '@nextui-org/react'
import { PostForm } from '@/components/post/PostForm'
import { ROUTES } from '@/config/routes'
import { Save } from 'lucide-react'
import { LanguageSelector } from '@/components/post/LanguageSelector'
import { Language } from '@/types/api/post/types'

export default function NewPostPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ja')

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
          mode="create"
          redirectPath={ROUTES.DASHBOARD.POSTS.BASE}
          id="post-form"
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
  )
}
