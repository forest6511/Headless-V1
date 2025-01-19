// app/[lang]/categories/[[..slug]]/page.tsx
import { ArticleCard } from '@/components/features/article'
import { type Locale } from '@/types/i18n'
import { getMetadata } from '@/lib/metadata'
import { type Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getCategoryArticles } from '@/lib/api/category'

type PageProps = {
  params: Promise<{ lang: Locale; slug?: string[] }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const { lang, slug = [] } = params
  const dictionary = await getDictionary(lang)
  const categoryPath = slug.join('/')
  const categoryWithArticles = await getCategoryArticles(categoryPath, lang)

  return getMetadata({
    params,
    options: {
      title: categoryWithArticles
        ? categoryWithArticles.category.name
        : dictionary.common.notFound,
      description: categoryWithArticles
        ? categoryWithArticles.category.description ||
          categoryWithArticles.category.name // description が null の場合は name を使用
        : dictionary.common.notFound,
    },
  })
}

export default async function CategoriesPage(props: PageProps) {
  const params = await props.params
  const { lang, slug = [] } = params
  const dictionary = await getDictionary(lang)
  const categoryPath = slug.join('/')

  try {
    const categoryWithArticles = await getCategoryArticles(categoryPath, lang)

    return (
      <article className="py-4">
        {/* カテゴリ情報 */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold mb-4 text-left pl-4 sm:pl-0">
            {categoryWithArticles.category.name}
          </h1>

          {categoryWithArticles.category.description && (
            <div className="font-semibold mb-2 text-left pl-4 sm:pl-0">
              <p className="text-muted-foreground">
                {categoryWithArticles.category.description}
              </p>
            </div>
          )}
        </div>

        {/* 記事一覧 */}
        <div className="grid gap-4">
          {categoryWithArticles.articles.map((article) => (
            <ArticleCard key={article.slug} {...article} lang={lang} />
          ))}
        </div>
      </article>
    )
  } catch (error) {
    console.error('Failed to fetch category articles:', error)
    return (
      <div className="py-4">
        <p role="alert" className="text-center text-red-500">
          {dictionary.common.fetchError}
        </p>
      </div>
    )
  }
}
