// lib/api/sitemap.ts
import { type Locale } from '@/types/i18n'
import { getCacheOptions } from '@/lib/fetchOptions'
import { ArticleCardProps } from '@/types/article'

type SitemapArticle = {
  slug: string
  updatedAt: string
}

export async function getSitemapArticles(
  lang: Locale
): Promise<SitemapArticle[]> {
  const res = await fetch(
    // サイトマップ用にページサイズを大きく設定
    `${process.env.API_BASE_URL}/api/client/posts?language=${lang}&pageSize=1000`,
    {
      ...getCacheOptions(),
      headers: {
        Accept: 'application/json',
      },
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch sitemap articles: ${res.status}`)
  }

  const articles = await res.json()

  // サイトマップに必要な情報だけを抽出
  return articles.map((article: ArticleCardProps) => ({
    slug: article.slug,
    updatedAt: article.updatedAt,
  }))
}
