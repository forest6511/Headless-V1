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
    .max(255, 'スラッグは255文字以内で入力してください'),
  content: z.string().min(1, '本文は必須です'),
  excerpt: z
    .string()
    .min(1, '抜粋は必須です')
    .max(100, '抜粋は100文字以内で入力してください'),
  status: z
    .string()
    .min(1, 'ステータスは必須です')
    .max(50, 'ステータスは50文字以内で入力してください'),
  postType: z
    .string()
    .min(1, '投稿タイプは必須です')
    .max(50, '投稿タイプは50文字以内で入力してください'),
  featuredImageId: z.string().uuid().optional(),
  metaTitle: z
    .string()
    .max(255, 'メタタイトルは255文字以内で入力してください')
    .optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  robotsMetaTag: z
    .string()
    .max(50, 'robotsメタタグは50文字以内で入力してください')
    .optional(),
  canonicalUrl: z
    .string()
    .max(255, '正規URLは255文字以内で入力してください')
    .optional(),
  ogTitle: z
    .string()
    .max(255, 'OGタイトルは255文字以内で入力してください')
    .optional(),
  ogDescription: z.string().optional(),
  ogImage: z
    .string()
    .max(255, 'OG画像URLは255文字以内で入力してください')
    .optional(),
})

export const CreatePostSchema = PostSchema.omit({
  id: true,
})

export const UpdatePostSchema = PostSchema.partial().omit({
  id: true,
})

export type Post = z.infer<typeof PostSchema>
export type CreatePost = z.infer<typeof CreatePostSchema>
export type UpdatePost = z.infer<typeof UpdatePostSchema>
