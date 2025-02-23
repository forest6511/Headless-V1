import { ArticleHeader } from '@/components/features/article/components/article-header'
import { ArticleContent } from '@/components/features/article/components/article-content'
import { ArticleCardProps } from '@/types/article'
import { Locale } from '@/types/i18n'
// import { ArticleMetrics } from '@/components/features/article/components/article-metrics'

export function ArticleCard(props: ArticleCardProps & { lang: Locale }) {
  return (
    <article className="border rounded-md mb-3 last:mb-0 sm:mb-4">
      <div className="p-4 sm:p-6">
        <ArticleHeader
          // author={props.author}
          date={props.updatedAt}
        />
        <ArticleContent
          lang={props.lang}
          slug={props.slug}
          category={props.category}
          title={props.title}
          description={props.description}
          tags={props.tags}
          featuredImage={props.featuredImage}
        />
        {/* <ArticleMetrics reactions={props.reactions} comments={props.comments} /> */}
      </div>
    </article>
  )
}
