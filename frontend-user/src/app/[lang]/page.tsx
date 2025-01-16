// app/page.tsx
import { ArticleCard } from '@/components/features/article'
import { type Locale } from '@/types/i18n'
import { ArticleCardProps } from '@/components/features/article/types'

type PageProps = {
  params: Promise<{ lang: Locale }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getLatestArticles(lang: Locale): Promise<ArticleCardProps[]> {
  const res = await fetch(
    `${process.env.API_BASE_URL}/api/client/posts?language=${lang}&pageSize=20`,
    {
      next: { revalidate: 3600 },
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch articles')
  }

  const articles = await res.json()

  return articles.map((article: ArticleCardProps) => ({
    ...article,
    createdAt: new Date(article.createdAt).toLocaleDateString(
      lang === 'ja' ? 'ja-JP' : 'en-US',
      { month: 'long', day: 'numeric' }
    ),
    updatedAt: new Date(article.updatedAt).toLocaleDateString(
      lang === 'ja' ? 'ja-JP' : 'en-US',
      { month: 'long', day: 'numeric' }
    ),
  }))
}

export default async function Home(props: PageProps) {
  const params = await props.params
  // params からプロパティを非同期的に取得
  const { lang } = await Promise.resolve(params)
  const articles = await getLatestArticles(lang)

  return (
    <div className="py-4">
      {articles.map((article) => (
        <ArticleCard key={article.slug} {...article} />
      ))}
    </div>
  )
}
