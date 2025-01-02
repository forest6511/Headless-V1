import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { postApi } from '@/lib/api'
import { PostResponse } from '@/types/api/post/response'
import { ROUTES } from '@/config/routes'
import { PostFormData } from '@/schemas/post'

// PostResponseからPostFormDataへ変換する関数を追加
export const convertPostResponseToFormData = (
  post: PostResponse,
  language: string = 'ja'
): PostFormData => {
  // デフォルト言語を設定（現在は'ja'）
  const translation =
    post.translations.find((t) => t.language === language) ||
    post.translations[0]

  return {
    id: post.id,
    language: translation.language,
    title: translation.title,
    slug: post.slug,
    content: translation.content,
    excerpt: translation.excerpt,
    status: post.status,
    featuredImageId: post.featuredImageId,
    categoryId: post.categoryId,
    tagNames: post.tags.map((tag) => `${tag.name}`).join(','),
  }
}

export const usePostDetail = (postId: string) => {
  const router = useRouter()
  const [post, setPost] = useState<PostResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await postApi.getPost(postId)
        if (!fetchedPost) {
          router.push(ROUTES.DASHBOARD.POSTS.BASE)
        } else {
          console.log('setPost', fetchedPost)
          setPost(fetchedPost)
        }
      } catch (error) {
        console.error('Error fetching post:', error)
        router.push(ROUTES.DASHBOARD.POSTS.BASE)
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
