'use client'
// https://react.dev/reference/react/use
import { use } from 'react'

import { Card, CardBody } from '@nextui-org/react'
import { ROUTES } from '@/config/routes'
import { PostForm } from '@/components/post/PostForm'
import { usePostDetail } from '@/hooks/post/usePostDetail'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default function EditPostPage(props: Props) {
  const params = use(props.params)
  const { post, isLoading } = usePostDetail(params.id)

  if (isLoading) return <p>Loading...</p>
  if (!post) return null

  return (
    <Card className="w-full">
      <CardBody>
        <h1 className="text-2xl font-bold mb-6">記事の編集</h1>
        <PostForm
          mode="update"
          redirectPath={ROUTES.DASHBOARD.POSTS.BASE}
          initialData={post}
        />
      </CardBody>
    </Card>
  )
}
