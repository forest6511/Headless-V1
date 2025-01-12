import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { postApi } from '@/lib/api'
import { PostResponse } from '@/types/api/post/response'
import { ROUTES } from '@/config/routes'
import { PostFormData } from '@/schemas/post'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { parseLanguage } from '@/types/api/common/types'

// PostResponseからPostFormDataへ変換する関数を追加
export const convertPostResponseToFormData = (
  post: PostResponse
): PostFormData => {
  // ストアから現在の言語を取得
  const currentLanguage = useLanguageStore.getState().language

  // 現在の言語に対応する翻訳を探す、なければ最初の翻訳を使用
  const translation =
    post.translations.find((t) => t.language === currentLanguage) ||
    post.translations[0]

  return {
    id: post.id,
    language: parseLanguage(translation.language),
    title: translation.title,
    content: translation.content,
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
