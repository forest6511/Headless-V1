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
  tagNames: z
    .string()
    .optional()
    .refine(
      (val) => {
        // 空文字列の場合は許可
        if (val === '' || val === null || val === undefined) return true
        // 末尾のカンマを削除
        const trimmedVal = val.replace(/,+$/, '')
        // カンマ区切りでタグをチェック
        const tags = trimmedVal.split(',').map((tag) => tag.trim())
        // タグ数のチェック
        if (tags.length > 3) return false
        // 各タグが #英数字 の形式かチェック
        return tags.every((tag) => /^#[a-zA-Z0-9]+$/.test(tag))
      },
      {
        message: 'タグは#英数字の形式で、カンマ区切り、最大3個まで入力できます',
      }
    ),
})

// 登録時(idを除外）
export const createPostSchema = PostSchema.omit({
  id: true,
})

// 更新用（全フィールド必須）
export const updatePostSchema = PostSchema

export type CreatePostFormData = z.infer<typeof createPostSchema>
export type UpdatePostFormData = z.infer<typeof updatePostSchema>

// フォーム共通の型定義
export type PostFormData = CreatePostFormData & Partial<UpdatePostFormData>
