import { Button } from '@/components/ui/button'
import { Bookmark, MoreHorizontal } from 'lucide-react'

export function ArticleActions() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Bookmark className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  )
}
