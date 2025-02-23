// app/[lang]/articles/[slug]/page.tsx
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { type Locale } from '@/types/i18n'
import { getArticle } from '@/lib/api/article'
import { formatDate, toISODate } from '@/lib/date'
import { getMetadata } from '@/lib/metadata'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { notFound } from 'next/navigation'
import { CategoryBreadcrumbs } from '@/components/features/article/components/category-breadcrumbs'
import { ArticlePageProps } from '@/types/article'

export async function generateMetadata(props: {
  params: Promise<{ lang: Locale; slug: string }>
}) {
  const params = await props.params
  const dictionary = await getDictionary(params.lang)
  const article = await getArticle(params.slug, params.lang)
  return getMetadata({
    params,
    options: {
      title: article ? article.title : dictionary.common.notFound,
      description: article ? article.description : dictionary.common.notFound,
    },
  })
}

type PageProps = {
  params: Promise<{ lang: Locale; slug: string }>
}

export default async function ArticlePage(props: PageProps) {
  const params = await props.params
  const { lang, slug } = params
  const dictionary = await getDictionary(lang)
  const article: ArticlePageProps | null = await getArticle(slug, lang)

  if (!article) {
    notFound()
  }

  const formattedDate = formatDate(article.updatedAt, lang)

  return (
    <main className="py-6 ml-4 mr-4 -mt-1 pb-2">
      <nav className="mb-6 overflow-auto" aria-label="パンくずリスト">
        <ol className="flex min-w-0 items-center space-x-2 text-sm text-muted-foreground whitespace-nowrap">
          <li>
            <Link href={`/${lang}`} className="hover:text-foreground">
              {dictionary.common.home}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          <CategoryBreadcrumbs
            lang={lang}
            categoryPath={article.category.path}
          />
        </ol>
      </nav>

      <article itemScope itemType="http://schema.org/Article">
        {/*<div className="flex items-center space-x-2 mb-6">*/}
        {/*  <Avatar className="h-8 w-8">*/}
        {/*    <AvatarImage src={article.author.image} alt={article.author.name} />*/}
        {/*    <AvatarFallback>{article.author.name[0]}</AvatarFallback>*/}
        {/*  </Avatar>*/}
        {/*  <div>*/}
        {/*    <div className="flex items-center">*/}
        {/*      <Link href="#" className="font-medium hover:text-blue-600">*/}
        {/*        {article.author.name}*/}
        {/*      </Link>*/}
        {/*    </div>*/}
        {/*    <p className="text-sm text-muted-foreground">{article.date}</p>*/}
        {/*  </div>*/}
        {/*</div>*/}

        <header>
          {article.featuredImage && (
            <div className="mb-6">
              <img
                src={article.featuredImage.smallUrl}
                srcSet={`${article.featuredImage.smallUrl} 375w, ${article.featuredImage.largeUrl} 800w`}
                sizes="(max-width: 375px) 375px, 800px"
                alt={
                  article.featuredImage.translations[0]?.title || article.title
                }
                className="w-full max-h-[800px] object-cover rounded-lg"
                decoding="async"
                loading="eager"
                width={800}
                height={800}
              />
            </div>
          )}
          <h1
            itemProp="headline"
            className="text-xl sm:text-3xl font-bold mb-4"
          >
            {article.title}
          </h1>
          <time
            dateTime={toISODate(article.updatedAt)}
            itemProp="dateModified"
            className="text-sm text-muted-foreground mb-4 block"
          >
            {dictionary.common.lastUpdated}: {formattedDate}
          </time>
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/${lang}/tags/${tag}`}
                  className="text-sm text-muted-foreground hover:text-blue-600"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        <div
          itemProp="articleBody"
          className="prose prose-lg max-w-none mb-3"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* 記事アクションのコメントアウト部分 - そのまま維持 */}
        {/*<div className="flex flex-wrap items-center justify-between pt-3 border-t gap-4">*/}
        {/*  <div className="flex flex-wrap items-center gap-2">*/}
        {/*    <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">*/}
        {/*      <ThumbsUp className="mr-1 h-4 w-4" />*/}
        {/*      <span className="text-sm">{article.reactions}</span>*/}
        {/*    </Button>*/}
        {/*    <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">*/}
        {/*      <MessageSquare className="mr-1 h-4 w-4" />*/}
        {/*      <span className="text-sm">{article.comments}</span>*/}
        {/*    </Button>*/}
        {/*  </div>*/}
        {/*  <div className="flex items-center gap-2">*/}
        {/*    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">*/}
        {/*      <Bookmark className="h-4 w-4" />*/}
        {/*    </Button>*/}
        {/*    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">*/}
        {/*      <MoreHorizontal className="h-4 w-4" />*/}
        {/*    </Button>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </article>
    </main>
  )
}
