// app/[lang]/page.tsx
import { ArticleCard } from '@/components/features/article'
import { type Locale } from '@/types/i18n'
import { getLatestArticles } from '@/lib/api/home'
import { getMetadata } from '@/lib/metadata'
import { type Metadata } from 'next'

type PageProps = {
  params: Promise<{ lang: Locale }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const baseMetadata = await getMetadata({ params })
  const { lang } = await Promise.resolve(params)

  return {
    ...baseMetadata,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ja: '/ja',
        en: '/en',
      },
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await Promise.resolve(params)

  try {
    const articles = await getLatestArticles(lang)

    return (
      <article className="py-4">
        <h1 className="sr-only">最新の記事一覧</h1>

        <div className="space-y-4">
          {articles.map((article) => (
            <ArticleCard key={article.slug} {...article} />
          ))}
        </div>
      </article>
    )
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    return (
      <div className="py-4">
        <p role="alert" className="text-center text-red-500">
          記事の取得に失敗しました。しばらく経ってからお試しください。
        </p>
      </div>
    )
  }
}
