import {CategoryListResponse} from '@/types/api/category/response'
import {
  CreateCategoryData,
  UpdateCategoryData,
} from '@/schemas/category'

export const NOSETTING_SLUG = 'nosetting'

export interface CategoryFormCommonProps {
  redirectPath: string
}

export interface CreateCategoryFormProps extends CategoryFormCommonProps {
  initialData?: Partial<CreateCategoryData>
}

export interface UpdateCategoryFormProps extends CategoryFormCommonProps {
  initialData: UpdateCategoryData
}

export const formatCategoryOptions = (categories: CategoryListResponse[]) =>
    categories.map((category) => ({
    key: category.id,
    label: category.name,
  }))

export const formatCategoryOptionsWithoutNoSetting = (
    categories: CategoryListResponse[]
) =>
  categories
    .filter((category) => category.slug !== NOSETTING_SLUG)
    .map((category) => ({
      key: category.id,
      label: category.name,
    }))
