import { MessageSquare, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ArticleMetricsProps {
  reactions: number
  comments: number
}

export function ArticleMetrics({ reactions, comments }: ArticleMetricsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="ghost" size="sm" className="text-muted-foreground h-8">
        <ThumbsUp className="mr-1 h-4 w-4" />
        <span className="text-sm">{reactions} リアクション</span>
      </Button>
      <Button variant="ghost" size="sm" className="text-muted-foreground h-8">
        <MessageSquare className="mr-1 h-4 w-4" />
        <span className="text-sm">{comments} コメント</span>
      </Button>
    </div>
  )
}
