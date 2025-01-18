import { ArticleHeader } from '@/components/features/article/components/article-header'
import { ArticleContent } from '@/components/features/article/components/article-content'
import { ArticleCardProps } from '@/types/article'
// import { ArticleMetrics } from '@/components/features/article/components/article-metrics'

export function ArticleCard(props: ArticleCardProps) {
  return (
    <article className="border-y sm:border sm:rounded-md mb-3 last:mb-0 sm:mb-4">
      <div className="p-4 sm:p-6">
        <ArticleHeader
          // author={props.author}
          date={props.updatedAt}
        />
        <ArticleContent
          slug={props.slug}
          category={props.category}
          title={props.title}
          description={props.description}
          tags={props.tags}
        />
        {/* <ArticleMetrics reactions={props.reactions} comments={props.comments} /> */}
      </div>
    </article>
  )
}
