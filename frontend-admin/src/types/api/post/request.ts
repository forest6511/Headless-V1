interface BasePost {
  language: string
  title: string
  slug: string
  content: string
  excerpt: string
  status: string
  featuredImageId: string | null
  categoryId: string
  tagNames: string[]
}

// 記事作成時用のインターフェース
export interface CreatePostRequest extends BasePost {
  language: string // デフォルト "ja" はバックエンドで設定
}

// 記事更新時用のインターフェース
export interface UpdatePostRequest extends BasePost {
  id: string
  language: string // デフォルト "ja" はバックエンドで設定
}

// 記事一覧用のインターフェース
export interface ListPostRequest {
  cursorPostId?: string
  pageSize?: number
}
