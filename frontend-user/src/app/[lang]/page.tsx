// app/[lang]/page.tsx
import { ArticleCard } from '@/components/features/article'
import { type Locale } from '@/types/i18n'
import { getLatestArticles } from '@/lib/api/home'
import { getMetadata } from '@/lib/metadata'
import { type Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'

type PageProps = {
  params: Promise<{ lang: Locale }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
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

export default async function HomePage(props: PageProps) {
  const params = await props.params
  const { lang } = params
  const dictionary = await getDictionary(lang)

  try {
    const articles = await getLatestArticles(lang)

    return (
      <article className="py-4">
        <h1 className="text-xl font-semibold mb-4 text-left pl-4 sm:pl-0">{dictionary.home.latestArticles}</h1>

        <div className="grid gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.slug} {...article} lang={lang} />
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
