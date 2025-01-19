// app/[lang]/tags/[tag]/page.tsx
import { ArticleCard } from '@/components/features/article'
import { type Locale } from '@/types/i18n'
import { getMetadata } from '@/lib/metadata'
import { type Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getTagArticles } from '@/lib/api/tag'

type PageProps = {
  params: Promise<{ lang: Locale; tag: string }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const { lang, tag } = params
  const dictionary = await getDictionary(lang)

  const tagWithArticles = await getTagArticles(tag, lang)
  return getMetadata({
    params,
    options: {
      title: tagWithArticles.slug,
      description: `${dictionary.common.articles} - ${tagWithArticles.slug}`,
    },
  })
}

export default async function TagPage(props: PageProps) {
  const params = await props.params
  const { lang, tag } = params
  const dictionary = await getDictionary(lang)

  try {
    const tagWithArticles = await getTagArticles(tag, lang)

    return (
      <article className="py-4">
        <div className="mb-4">
          <h1 className="text-xl font-semibold mb-4 text-left pl-4 sm:pl-0">
            #{tagWithArticles.slug}
          </h1>
        </div>

        <div className="grid gap-4">
          {tagWithArticles.articles.map((article) => (
            <ArticleCard key={article.slug} {...article} lang={lang} />
          ))}
        </div>
      </article>
    )
  } catch (error) {
    console.error('Failed to fetch tag articles:', error)
    return (
      <div className="py-4">
        <p role="alert" className="text-center text-red-500">
          {dictionary.common.fetchError}
        </p>
      </div>
    )
  }
}
