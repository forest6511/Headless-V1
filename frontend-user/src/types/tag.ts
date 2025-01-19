export interface TagWithArticles {
  slug: string
  articles: {
    slug: string
    title: string
    description: string
    createdAt: string
    updatedAt: string
    tags: string[]
    category: {
      path: {
        slug: string
        name: string
        description: string | null
      }[]
    }
  }[]
}
