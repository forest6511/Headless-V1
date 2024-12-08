import { TaxonomyType } from '@/types/api/taxonomy/types'

interface BaseTaxonomyRequest {
  name: string
  type: TaxonomyType
  slug: string
  description?: string
  parentId?: string
}

// 新規作成リクエスト
export interface CreateTaxonomyRequest extends BaseTaxonomyRequest {}

// 更新リクエスト
export interface UpdateTaxonomyRequest extends BaseTaxonomyRequest {
  id: string
}

// 削除リクエスト
export interface DeleteTaxonomyRequest {
  id: string
}
