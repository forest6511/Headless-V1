import { z } from 'zod'

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(255, 'タイトルは255文字以内で入力してください'),
  slug: z
    .string()
    .min(1, 'スラッグは必須です')
    .max(255, 'スラッグは255文字以内で入力してください')
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      'スラッグには英数字、ハイフン（-）、またはアンダースコア（_）のみ使用できます'
    ),
  content: z.string().min(1, '本文は必須です'),
  excerpt: z
    .string()
    .min(1, '抜粋は必須です')
    .max(150, '抜粋は150文字以内で入力してください'),
  postStatus: z
    .string()
    .min(1, 'ステータスは必須です')
    .max(50, 'ステータスは50文字以内で入力してください'),
  featuredImageId: z
    .string()
    .transform((val) => (val === '' ? null : val)) // empty to null
    .nullish(),
  metaTitle: z
    .string()
    .max(255, 'メタタイトルは255文字以内で入力してください')
    .transform((val) => (val === '' ? null : val)) // empty to null
    .nullish(),
  metaDescription: z
    .string()
    .max(150, 'メタディスクリプションは150文字以内で入力してください')
    .transform((val) => (val === '' ? null : val)) // empty to null
    .nullable(),
  metaKeywords: z
    .string()
    .transform((val) => (val === '' ? null : val)) // empty to null
    .nullish(),
  ogTitle: z
    .string()
    .max(255, 'OGタイトルは255文字以内で入力してください')
    .transform((val) => (val === '' ? null : val)) // empty to null
    .nullish(),
  ogDescription: z
    .string()
    .max(150, 'OGディスクリプションは150文字以内で入力してください')
    .transform((val) => (val === '' ? null : val)) // empty to null
    .nullish(),
  categoryId: z
    .string()
    .min(1, 'カテゴリは必須です')
    .uuid('カテゴリIDが正しくありません'),
})

export const createPostSchema = PostSchema.omit({
  id: true,
})

export const updatePostSchema = PostSchema.partial().omit({
  id: true,
})

export type Post = z.infer<typeof PostSchema>
export type CreatePostFormData = z.infer<typeof createPostSchema>
export type UpdatePostFormData = z.infer<typeof updatePostSchema>
