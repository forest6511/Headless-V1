// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getSitemapArticles } from '@/lib/api/sitemap'
import { LOCALES, type Locale } from '@/types/i18n'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_CLIENT_URL || ''

  const routes = LOCALES.map((locale: Locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }))

  try {
    const articlesByLocale = await Promise.all(
      LOCALES.map((locale) => getSitemapArticles(locale))
    )

    const articleUrls = articlesByLocale.flatMap((articles, index) =>
      articles.map((article) => ({
        url: `${baseUrl}/${LOCALES[index]}/articles/${article.slug}`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }))
    )

    return [...routes, ...articleUrls]
  } catch (error) {
    console.error('Failed to generate sitemap:', error)
    return routes
  }
}
