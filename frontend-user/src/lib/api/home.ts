// lib/api/home.ts
import { type Locale } from '@/types/i18n'
import { ArticleCardProps } from '@/components/features/article/types'
import { formatDate } from '@/lib/date'

export async function getLatestArticles(
  lang: Locale
): Promise<ArticleCardProps[]> {
  const res = await fetch(
    `${process.env.API_BASE_URL}/api/client/posts?language=${lang}&pageSize=20`,
    {
      next: { revalidate: 3600 },
      headers: {
        Accept: 'application/json',
      },
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch articles: ${res.status}`)
  }

  const articles = await res.json()

  return articles.map((article: ArticleCardProps) => ({
    ...article,
    createdAt: formatDate(article.createdAt, lang),
    updatedAt: formatDate(article.updatedAt, lang),
  }))
}
