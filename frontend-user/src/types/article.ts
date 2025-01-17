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
