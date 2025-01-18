// lib/api/article.ts
import { ArticlePageProps } from '@/types/article'
import { Locale } from '@/types/i18n'
import { getCacheOptions } from '@/lib/fetchOptions'

export async function getArticle(
  slug: string,
  lang: Locale
): Promise<ArticlePageProps | null> {
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/api/client/posts/${slug}?language=${lang}`,
      {
        ...getCacheOptions(),
        headers: {
          Accept: 'application/json',
        },
      }
    )

    if (!res.ok) {
      return null
    }

    return await res.json()
  } catch (error) {
    console.error('Failed to fetch article:', error)
    return null
  }
}
