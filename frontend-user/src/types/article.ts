// Home
export type ArticleCardProps = {
  slug: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  tags: string[]
  category: {
    // 完全なパスを配列で表現
    path: {
      slug: string
      name: string
    }[]
  }
}

// 記事詳細ページ用
export type ArticlePageProps = {
  slug: string
  title: string
  description: string
  content: string
  createdAt: string
  updatedAt: string
  tags: string[]
  category: {
    path: {
      slug: string
      name: string
    }[]
  }
  // 将来的に追加予定の項目をコメントで残しておく
  // author?: {
  //   name: string
  //   image: string
  // }
  // reactions?: number
  // comments?: number
}
