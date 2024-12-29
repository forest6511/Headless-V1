'use client'

import { Button, Card, CardBody } from '@nextui-org/react'
import { PostForm } from '@/components/post/PostForm'
import { ROUTES } from '@/config/routes'
import { Save } from 'lucide-react'

export default function NewPostPage() {
  return (
    <Card className="w-full">
      <CardBody>
        <div className="flex justify-between items-center mb-6">
          <Button
            type="submit"
            form="post-form"
            color="primary"
            size={'md'}
            startContent={<Save size={20} />}
          >
            記事の保存
          </Button>
        </div>
        <PostForm
          mode="create"
          redirectPath={ROUTES.DASHBOARD.POSTS.BASE}
          id="post-form"
        />
      </CardBody>
    </Card>
  )
}
