'use client'

import { CreatePostForm } from '@/components/post/CreatePostForm'

export default function NewPostPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">記事の新規作成</h1>
      <CreatePostForm redirectPath="/admin/dashboard/posts" />
    </div>
  )
}
