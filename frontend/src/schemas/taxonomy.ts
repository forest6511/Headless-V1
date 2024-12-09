import { z } from 'zod'
import { TaxonomyType } from '@/types/api/taxonomy/types'

// 共通のベーススキーマ
const baseTaxonomySchema = z.object({
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
  type: z.union([z.literal('CATEGORY'), z.literal('TAG')]),
})

// 新規作成スキーマ
export const createTaxonomySchema = baseTaxonomySchema

// 更新スキーマ（IDを含む）
export const updateTaxonomySchema = baseTaxonomySchema.extend({
  id: z.string().uuid('有効なIDではありません'),
})

// 型の定義
export type CreateTaxonomyFormData = z.infer<typeof createTaxonomySchema> & {
  type: Extract<TaxonomyType, 'CATEGORY'>
}

export type UpdateTaxonomyFormData = z.infer<typeof updateTaxonomySchema> & {
  type: Extract<TaxonomyType, 'CATEGORY'>
}
