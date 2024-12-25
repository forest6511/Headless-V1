'use client'

import { Card, CardBody } from '@nextui-org/react'
import { PostForm } from '@/components/admin/post/PostForm'
import { ROUTES } from '@/config/routes'

export default function NewPostPage() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardBody>
        <h1 className="text-2xl font-bold mb-6">記事の新規作成</h1>
        <PostForm mode="create" redirectPath={ROUTES.DASHBOARD.POSTS.BASE} />
      </CardBody>
    </Card>
  )
}
