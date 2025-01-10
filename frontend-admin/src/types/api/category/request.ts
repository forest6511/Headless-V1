interface BaseCategoryRequest {
  language: string
  name: string
  description?: string
  parentId?: string
}

// 新規作成リクエスト
export interface CreateCategoryRequest extends BaseCategoryRequest {}

// 更新リクエスト
export interface UpdateCategoryRequest extends BaseCategoryRequest {
  id: string
}
