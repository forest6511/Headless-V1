// lib/api/category.ts
import { type Locale } from '@/types/i18n'
import { Category, CategoryWithArticles } from '@/types/category'
import { getCacheOptions } from '@/lib/fetchOptions'
import { formatDate } from '@/lib/date'

export async function getCategories(lang: Locale): Promise<Category[]> {
  const res = await fetch(
    `${process.env.API_BASE_URL}/api/client/categories?language=${lang}`,
    {
      ...getCacheOptions(),
      headers: {
        Accept: 'application/json',
      },
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`)
  }
  return res.json()
}

type CategoryArticle = CategoryWithArticles['articles'][0]

export async function getCategoryArticles(
  slug: string | string[],
  lang: Locale
): Promise<CategoryWithArticles> {
  const res = await fetch(
    `${process.env.API_BASE_URL}/api/client/categories/${slug}?language=${lang}&pageSize=10`,
    {
      ...getCacheOptions(),
      headers: {
        Accept: 'application/json',
      },
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch category articles: ${res.status}`)
  }

  const data = await res.json()

  return {
    category: data.category,
    articles: data.articles.map((article: CategoryArticle) => ({
      ...article,
      createdAt: formatDate(article.createdAt, lang),
      updatedAt: formatDate(article.updatedAt, lang),
    })),
  }
}
