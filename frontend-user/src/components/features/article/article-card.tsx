import { ArticleHeader } from '@/components/features/article/components/article-header'
import { ArticleContent } from '@/components/features/article/components/article-content'
import { ArticleMetrics } from '@/components/features/article/components/article-metrics'

interface ArticleCardProps {
  title: string
  description: string
  author: {
    name: string
    image: string
  }
  date: string
  reactions: number
  comments: number
  tags?: string[]
}

export function ArticleCard(props: ArticleCardProps) {
  return (
    <article className="border-y sm:border sm:rounded-md mb-3 last:mb-0 sm:mb-4">
      <div className="p-4 sm:p-6">
        <ArticleHeader author={props.author} date={props.date} />
        <ArticleContent
          title={props.title}
          description={props.description}
          tags={props.tags}
        />
        <ArticleMetrics reactions={props.reactions} comments={props.comments} />
      </div>
    </article>
  )
}
