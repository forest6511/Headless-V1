// app/[lang]/categories/[[..slug]]/page.tsx
import { ArticleCard } from '@/components/features/article'
import { type Locale } from '@/types/i18n'
import { getMetadata } from '@/lib/metadata'
import { type Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getCategoryArticles } from '@/lib/api/category'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

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
        {/* パンくずリスト */}
        <nav className="mb-6 overflow-auto" aria-label="パンくずリスト">
          <ol className="flex min-w-0 items-center space-x-2 text-sm text-muted-foreground whitespace-nowrap">
            <li>
              <Link href={`/${lang}`} className="hover:text-foreground">
                {dictionary.common.home}
              </Link>
            </li>
            {slug.map((s, index) => {
              // 現在のカテゴリまでのパスを構築
              const currentPath = slug.slice(0, index + 1).join('/')
              return (
                <li key={s} className="flex items-center">
                  <ChevronRight className="h-4 w-4 mx-2" />
                  <Link
                    href={`/${lang}/categories/${currentPath}`}
                    className="hover:text-foreground"
                  >
                    {s}
                  </Link>
                </li>
              )
            })}
          </ol>
        </nav>

        {/* カテゴリ情報 */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">
            {categoryWithArticles.category.name}
          </h1>
          {categoryWithArticles.category.description && (
            <p className="text-muted-foreground">
              {categoryWithArticles.category.description}
            </p>
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
