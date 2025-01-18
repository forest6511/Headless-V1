// app/[lang]/articles/[slug]/page.tsx
import sanitizeHtml from 'sanitize-html'
import { Metadata } from 'next'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Button } from '@/components/ui/button'
import {
  // ThumbsUp,
  // MessageSquare,
  // Bookmark,
  // MoreHorizontal,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { type Locale } from '@/types/i18n'
// import { ArticlePageProps } from '@/types/article'
import { getArticle } from '@/lib/api/article'
import { formatDate, toISODate } from '@/lib/date'

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale; slug: string }
}): Promise<Metadata> {
  const { lang, slug } = params
  const article = await getArticle(slug, lang)

  if (!article)
    return {
      title: '記事が見つかりません',
      description: '記事の詳細情報',
    }

  const sanitizedDescription = sanitizeHtml(article.description, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
  })

  return {
    title: article.title,
    description: sanitizedDescription,
    openGraph: {
      title: article.title,
      description: sanitizedDescription,
      type: 'article',
      publishedTime: toISODate(article.createdAt),
      modifiedTime: toISODate(article.updatedAt),
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: sanitizedDescription,
    },
  }
}

type PageProps = {
  params: Promise<{ lang: Locale, slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ArticlePage({ params }: PageProps) {
  const { lang, slug } = await Promise.resolve(params)
  const article = await getArticle(slug, lang)

  if (!article) {
    return <div className="p-4">記事が見つかりません</div>
  }

  const formattedDate = formatDate(article.updatedAt, lang)

  return (
    <main className="py-6 ml-4 mr-4 -mt-1 pb-2">
      <nav className="mb-6 overflow-auto" aria-label="パンくずリスト">
        <ol className="flex min-w-0 items-center space-x-2 text-sm text-muted-foreground whitespace-nowrap">
          <li>
            <Link href={`/${lang}`} className="hover:text-foreground">
              ホーム
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
          {article.category.path.map((cat, index) => (
            <li key={cat.slug}>
              <Link
                href={`/${lang}/categories/${cat.slug}`}
                className="hover:text-foreground"
              >
                {cat.name}
              </Link>
              {index < article.category.path.length - 1 && (
                <ChevronRight
                  className="h-4 w-4 inline ml-2"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </nav>

      <article itemScope itemType="http://schema.org/Article">
        {/* 著者情報のコメントアウト部分 - そのまま維持 */}
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
            最終更新: {formattedDate}
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

        {/*<div className="flex flex-wrap items-center justify-between pt-3 border-t gap-4">*/}
        {/*  <div className="flex flex-wrap items-center gap-2">*/}
        {/*    <Button*/}
        {/*      variant="ghost"*/}
        {/*      size="sm"*/}
        {/*      className="h-8 text-muted-foreground"*/}
        {/*    >*/}
        {/*      <ThumbsUp className="mr-1 h-4 w-4" />*/}
        {/*      <span className="text-sm">{article.reactions}</span>*/}
        {/*    </Button>*/}
        {/*    <Button*/}
        {/*      variant="ghost"*/}
        {/*      size="sm"*/}
        {/*      className="h-8 text-muted-foreground"*/}
        {/*    >*/}
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

        {/*<div className="flex flex-wrap items-center justify-between pt-3 border-t gap-4">*/}
        {/*  <div className="flex flex-wrap items-center gap-2">*/}
        {/*    <Button*/}
        {/*      variant="ghost"*/}
        {/*      size="sm"*/}
        {/*      className="h-8 text-muted-foreground"*/}
        {/*    >*/}
        {/*      <ThumbsUp className="mr-1 h-4 w-4" />*/}
        {/*      <span className="text-sm">{article.reactions}</span>*/}
        {/*    </Button>*/}
        {/*    <Button*/}
        {/*      variant="ghost"*/}
        {/*      size="sm"*/}
        {/*      className="h-8 text-muted-foreground"*/}
        {/*    >*/}
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
