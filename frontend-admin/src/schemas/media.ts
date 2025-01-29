import { z } from 'zod'
import { Language } from '@/types/api/common/types'
import { t } from '@/lib/translations'

// メディアアップロード用のスキーマ
export const createMediaUploadSchema = (language: Language) =>
  z.object({
    language: z.custom<Language>(),
    title: z
      .string()
      .min(1, t(language, 'media.upload.validation.titleRequired'))
      .max(50, t(language, 'media.upload.validation.titleTooLong')),
  })

export type MediaUploadData = z.infer<
  ReturnType<typeof createMediaUploadSchema>
>
