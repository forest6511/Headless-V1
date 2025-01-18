// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getSitemapArticles } from '@/lib/api/sitemap'
import { LOCALES, type Locale } from '@/types/i18n'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_CLIENT_URL || ''

  // LOCALESから動的にトップページのルートを生成
  const routes = LOCALES.map((locale: Locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0
  }))

  try {
    // すべての言語の記事を並行して取得
    const articlesByLocale = await Promise.all(
      LOCALES.map((locale) => getSitemapArticles(locale))
    )

    // 各言語のURLを生成
    const articleUrls = articlesByLocale.flatMap((articles, index) =>
      articles.map((article) => ({
        url: `${baseUrl}/${LOCALES[index]}/articles/${article.slug}`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: 'daily' as const,
        priority: 0.8
      }))
    )

    return [...routes, ...articleUrls]
  } catch (error) {
    console.error('Failed to generate sitemap:', error)
    return routes
  }
}