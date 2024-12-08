// Post インターフェース
interface Post {
  id: string // UUID
  title: string
  slug: string
  content: string // NOT NULL as specified
  excerpt: string // NOT NULL as specified
  status: string
  postType: string
  featuredImageId?: string // UUID, optional
  createdAt: Date
  updatedAt: Date
  // SEO関連フィールド（すべてオプショナル）
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  robotsMetaTag?: string
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
}

// 投稿作成時用のインターフェース
interface CreatePost extends Omit<Post, 'id' | 'createdAt' | 'updatedAt'> {}

// 投稿更新時用のインターフェース
interface UpdatePost
  extends Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt'>> {}
