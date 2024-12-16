import { z } from 'zod'

// 共通のベーススキーマ
const baseCategorySchema = z.object({
  name: z
    .string()
    .min(1, '名前は必須です')
    .max(255, '名前は255文字以内で入力してください'),
  slug: z
    .string()
    .min(1, 'スラッグは必須です')
    .max(255, 'スラッグは255文字以内で入力してください')
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      'スラッグには英数字、ハイフン（-）、またはアンダースコア（_）のみ使用できます'
    ),
  description: z
    .string()
    .max(100, '説明は100文字以内で入力してください')
    .optional(),
  parentId: z.string().nullish(),
})

// 新規作成スキーマ
export const createCategorySchema = baseCategorySchema

// 更新スキーマ（IDを含む）
export const updateCategorySchema = baseCategorySchema.extend({
  id: z.string().uuid('有効なIDではありません'),
})

// 型の定義
export type CreateCategoryData = z.infer<typeof createCategorySchema>

export type UpdateCategoryData = z.infer<typeof updateCategorySchema>