'use client'

import { CreatePostForm } from '@/components/admin/post/CreatePostForm'
import { ROUTES } from '@/config/routes'

export default function NewPostPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">記事の新規作成</h1>
      <CreatePostForm redirectPath={ROUTES.ADMIN.DASHBOARD.POSTS.BASE} />
    </div>
  )
}
