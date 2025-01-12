import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { ApiError } from '@/lib/api/core/client'
import { postApi } from '@/lib/api'
import {
  createPostSchema,
  PostFormData,
  createUpdatePostSchema,
} from '@/schemas/post'
import { CreatePostRequest, UpdatePostRequest } from '@/types/api/post/request'
import { t } from '@/lib/translations'
import { Language } from '@/types/api/common/types'
import { ZodSchema } from 'zod'

interface UsePostFormProps {
  redirectPath: string
  initialData?: PostFormData
  mode: 'create' | 'update'
  currentLanguage: Language
  schema?: ZodSchema // スキーマを任意のプロパティとして追加
}

export const usePostForm = ({
  redirectPath,
  initialData,
  mode,
  currentLanguage,
  schema, // スキーマを受け取る
}: UsePostFormProps) => {
  const router = useRouter()
  const [textLength, setTextLength] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // スキーマが指定されていない場合はデフォルトのスキーマを使用
  const resolvedSchema =
    schema ||
    (mode === 'create'
      ? createPostSchema(currentLanguage)
      : createUpdatePostSchema(currentLanguage))

  const form = useForm<PostFormData>({
    resolver: zodResolver(resolvedSchema),
    defaultValues: initialData,
  })

  const contentHtml = form.watch('content')

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true)
    try {
      const processedData = {
        ...data,
        tagNames: data.tagNames
          ? data.tagNames.split(',').map((tag) => tag.trim())
          : [],
        translations: [
          {
            language: currentLanguage,
            title: data.title,
            content: data.content,
          },
        ],
      }

      if (mode === 'create') {
        await postApi.createPost(processedData as CreatePostRequest)
        toast.success(t(currentLanguage, 'post.toast.createSuccess'))
      } else {
        await postApi.updatePost(processedData as UpdatePostRequest)
        toast.success(t(currentLanguage, 'post.toast.updateSuccess'))
      }
      router.push(redirectPath)
    } catch (error) {
      if (error instanceof ApiError) {
        const toastKey =
          mode === 'create'
            ? 'post.toast.createError'
            : 'post.toast.updateError'
        toast.error(`${t(currentLanguage, toastKey)} ${error?.details}`)
      }
      console.error(
        mode === 'create'
          ? t(currentLanguage, 'post.toast.createError')
          : t(currentLanguage, 'post.toast.updateError'),
        error
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditorChange = (html: string, length: number) => {
    form.setValue('content', html, {
      shouldValidate: true,
      shouldDirty: true,
    })
    setTextLength(length)
  }

  return {
    form,
    textLength,
    contentHtml,
    onSubmit: form.handleSubmit(onSubmit),
    handleEditorChange,
    isSubmitting,
  }
}
