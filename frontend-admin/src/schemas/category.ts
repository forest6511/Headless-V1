import { z } from 'zod'
import { Language } from '@/types/api/common/types'
import { t } from '@/lib/translations'

// 共通のベーススキーマ
const createBaseCategorySchema = (language: Language) =>
  z.object({
    language: z.custom<Language>(),
    name: z
      .string()
      .min(1, t(language, 'category.validation.nameRequired'))
      .max(255, t(language, 'category.validation.nameTooLong')),
    description: z
      .string()
      .max(100, t(language, 'category.validation.descriptionTooLong'))
      .optional(),
    parentId: z.string().nullish(),
  })

// 新規作成スキーマ
export const createCategorySchema = createBaseCategorySchema('ja')

// 更新スキーマ（IDを含む）
export const createUpdateCategorySchema = (language: Language) =>
  createBaseCategorySchema(language).extend({
    id: z.string().uuid(t(language, 'category.validation.invalidId')),
  })

export const updateCategorySchema = createUpdateCategorySchema('ja')

// 型の定義
export type CreateCategoryData = z.infer<typeof createCategorySchema>
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>
