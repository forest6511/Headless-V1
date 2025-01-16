// app/[lang]/page.tsx
import { ArticleCard } from '@/components/features/article'
import { type Locale } from '@/types/i18n'
import { ArticleCardProps } from '@/components/features/article/types'

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ja' }]
}

async function getLatestArticles(lang: Locale): Promise<ArticleCardProps[]> {
  const res = await fetch(
    `${process.env.API_BASE_URL}/api/client/posts?language=${lang}&pageSize=5`,
    {
      next: { revalidate: 3600 },
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch articles')
  }

  // APIのレスポンスはPostClientResponseの形式
  const articles = await res.json()

  return articles.map((article: ArticleCardProps) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    createdAt: new Date(article.createdAt).toLocaleDateString(
      lang === 'ja' ? 'ja-JP' : 'en-US',
      { month: 'long', day: 'numeric' }
    ),
    updatedAt: new Date(article.updatedAt).toLocaleDateString(
      lang === 'ja' ? 'ja-JP' : 'en-US',
      { month: 'long', day: 'numeric' }
    ),
    tags: article.tags,
    category: article.category,
  }))
}

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const articles = await getLatestArticles(lang)

  return (
    <div className="py-4">
      {articles.map((article) => (
        <ArticleCard key={article.slug} {...article} />
      ))}
    </div>
  )
}
