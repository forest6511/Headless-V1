import { z } from 'zod'
import { TaxonomyType } from '@/types/api/taxonomy/types'

export const taxonomySchema = z.object({
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
  parentId: z.string().min(1, '親カテゴリーは必須です'),
  type: z.union([z.literal('CATEGORY'), z.literal('TAG')]),
})

export type CategoryFormData = z.infer<typeof taxonomySchema> & {
  type: Extract<TaxonomyType, 'CATEGORY'>
}
