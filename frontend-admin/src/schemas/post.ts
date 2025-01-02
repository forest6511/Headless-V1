import { z } from 'zod'

export const BasePostSchema = z.object({
  language: z
    .string()
    .min(1, '言語は必須です')
    .max(5, '言語は5文字以内で入力してください')
    .default('ja'),
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(255, 'タイトルは255文字以内で入力してください'),
  slug: z
    .string()
    .min(1, 'スラッグは必須です')
    .max(255, 'スラッグは255文字以内で入力してください')
    .regex(
      /^[a-z0-9-_]+$/,
      'スラッグには英小文字、数字、ハイフン（-）、またはアンダースコア（_）のみ使用できます'
    ),
  content: z.string().min(1, '本文は必須です'),
  excerpt: z
    .string()
    .min(1, '抜粋は必須です')
    .max(100, '抜粋は100文字以内で入力してください'),
  status: z
    .string()
    .min(1, 'ステータスは必須です')
    .max(50, 'ステータスは50文字以内で入力してください'),
  featuredImageId: z
    .string()
    .uuid('画像IDが正しくありません')
    .transform((val) => (val === '' ? null : val))
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

// 登録時のスキーマ
export const createPostSchema = BasePostSchema

// 更新時のスキーマ（IDを追加）
export const updatePostSchema = BasePostSchema.extend({
  id: z.string().uuid('IDが正しくありません'),
})

export type CreatePostFormData = z.infer<typeof createPostSchema>
export type UpdatePostFormData = z.infer<typeof updatePostSchema>

// フォーム共通の型定義
export type PostFormData = CreatePostFormData & Partial<UpdatePostFormData>
