// lib/api/tag.ts
import { type Locale } from '@/types/i18n'
import { TagWithArticles } from '@/types/tag'
import { getCacheOptions } from '@/lib/fetchOptions'
import { formatDate } from '@/lib/date'

type TagArticle = TagWithArticles['articles'][0]

export async function getTagArticles(
  slug: string,
  lang: Locale
): Promise<TagWithArticles> {
  const res = await fetch(
    `${process.env.API_BASE_URL}/api/client/tags/${slug}?language=${lang}&pageSize=10`,
    {
      ...getCacheOptions(),
      headers: {
        Accept: 'application/json',
      },
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch tag articles: ${res.status}`)
  }

  const data = await res.json()

  return {
    slug: data.slug,
    articles: data.articles.map((article: TagArticle) => ({
      ...article,
      createdAt: formatDate(article.createdAt, lang),
      updatedAt: formatDate(article.updatedAt, lang),
    })),
  }
}
