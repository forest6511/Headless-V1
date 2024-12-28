import { ArticleMetrics } from '@/components/features/article/components/article-metrics'
import { ArticleActions } from '@/components/features/article/components/article-actions'

interface ArticleFooterProps {
  reactions: number
  comments: number
}

export function ArticleFooter({ reactions, comments }: ArticleFooterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
      <ArticleMetrics reactions={reactions} comments={comments} />
      <ArticleActions />
    </div>
  )
}
