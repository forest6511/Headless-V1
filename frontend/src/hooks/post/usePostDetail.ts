import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { postApi } from '@/lib/api'
import { PostWithCategoryId } from '@/types/api/post/response'
import { ROUTES } from '@/config/routes'

export const usePostDetail = (postId: string) => {
  const router = useRouter()
  const [post, setPost] = useState<PostWithCategoryId | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await postApi.getPost(postId)
        if (!fetchedPost) {
          router.push(ROUTES.ADMIN.DASHBOARD.POSTS.BASE)
        } else {
          setPost(fetchedPost)
        }
      } catch (error) {
        console.error('Error fetching post:', error)
        router.push(ROUTES.ADMIN.DASHBOARD.POSTS.BASE)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchPost()
  }, [postId, router])

  return {
    post,
    isLoading,
  }
}
