import { TaxonomyListResponse } from '@/types/api/taxonomy/response'
import {
  CreateTaxonomyFormData,
  UpdateTaxonomyFormData,
} from '@/schemas/taxonomy'

export const NOSETTING_SLUG = 'nosetting'
export type TaxonomyType = 'CATEGORY' | 'TAG'

export interface CategoryFormCommonProps {
  redirectPath: string
}

export interface CreateCategoryFormProps extends CategoryFormCommonProps {
  initialData?: Partial<CreateTaxonomyFormData>
}

export interface UpdateCategoryFormProps extends CategoryFormCommonProps {
  initialData: UpdateTaxonomyFormData
}

export const formatTaxonomyOptions = (taxonomies: TaxonomyListResponse[]) =>
  taxonomies.map((taxonomy) => ({
    key: taxonomy.id,
    label: taxonomy.name,
  }))

export const formatTaxonomyOptionsWithoutNoSetting = (
  taxonomies: TaxonomyListResponse[]
) =>
  taxonomies
    .filter((taxonomy) => taxonomy.slug !== NOSETTING_SLUG)
    .map((taxonomy) => ({
      key: taxonomy.id,
      label: taxonomy.name,
    }))
