'use client'
// https://react.dev/reference/react/use
import { use } from 'react'

import { Button, Card, CardBody } from '@nextui-org/react'
import { ROUTES } from '@/config/routes'
import { PostForm } from '@/components/post/PostForm'
import { usePostDetail } from '@/hooks/post/usePostDetail'
import { Save } from 'lucide-react'

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
          mode="update"
          redirectPath={ROUTES.DASHBOARD.POSTS.BASE}
          id="post-form"
          initialData={post}
        />
      </CardBody>
    </Card>
  )
}
