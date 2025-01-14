import { z } from 'zod'
import { Language } from '@/types/api/common/types'
import { t } from '@/lib/translations'
import { PostStatuses } from '@/types/api/post/types'

export const createBasePostSchema = (language: Language) =>
  z.object({
    language: z.custom<Language>(),
    title: z
      .string()
      .min(1, t(language, 'post.validation.title.required'))
      .max(100, t(language, 'post.validation.title.tooLong')),
    content: z.string().min(1, t(language, 'post.validation.content.required')),
    status: z
      .enum(['DRAFT', 'PUBLISHED'], {
        errorMap: () => ({
          message: t(language, 'post.validation.status.required'),
        }),
      })
      .refine((val) => PostStatuses.some((status) => status.value === val), {
        message: t(language, 'post.validation.status.required'),
      })
      .refine((val) => val.length <= 50, {
        message: t(language, 'post.validation.status.tooLong'),
      }),
    featuredImageId: z
      .string()
      .uuid(t(language, 'post.validation.image.invalidId'))
      .transform((val) => (val === '' ? null : val))
      .nullish(),
    categoryId: z
      .string()
      .min(1, t(language, 'post.validation.category.required'))
      .uuid(t(language, 'post.validation.category.invalidId')),
    tagNames: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (val === '' || val === null || val === undefined) return true
          const trimmedVal = val.replace(/,+$/, '')
          const tags = trimmedVal.split(',').map((tag) => tag.trim())
          if (tags.length > 3) return false
          return tags.every((tag) => /^#[a-zA-Z0-9]+$/.test(tag))
        },
        {
          message: t(language, 'post.validation.tags.format'),
        }
      ),
  })

// スキーマ生成関数を外部に公開
export const createPostSchema = (language: Language = 'ja') =>
  createBasePostSchema(language)

export const createUpdatePostSchema = (language: Language = 'ja') =>
  createBasePostSchema(language).extend({
    id: z.string().uuid(t(language, 'post.validation.category.invalidId')),
  })

export type CreatePostFormData = z.infer<ReturnType<typeof createPostSchema>>
export type UpdatePostFormData = z.infer<
  ReturnType<typeof createUpdatePostSchema>
>

// フォーム共通の型定義
export type PostFormData = CreatePostFormData & Partial<UpdatePostFormData>
