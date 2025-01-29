import { CategoryListResponse } from '@/types/api/category/response'
import { CreateCategoryData, UpdateCategoryData } from '@/schemas/category'

export const NOSETTING_SLUG = 'nosetting'

export interface CategoryFormCommonProps {
  redirectPath: string
  id?: string
  onSubmittingChange?: (isSubmitting: boolean) => void
}

export interface CreateCategoryFormProps extends CategoryFormCommonProps {
  initialData?: Partial<CreateCategoryData>
}

export interface UpdateCategoryFormProps extends CategoryFormCommonProps {
  initialData: UpdateCategoryData
}

export const formatCategoryOptionsWithoutNoSetting = (
  categories: CategoryListResponse[],
  language: string
) =>
  categories
    .filter((category) => category.slug !== NOSETTING_SLUG)
    .map((category) => ({
      key: category.id,
      label:
        category.translations.find((t) => t.language === language.toString())
          ?.name ?? '',
    }))
