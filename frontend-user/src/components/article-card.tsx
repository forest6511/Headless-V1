import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Bookmark, MoreHorizontal, ThumbsUp, MessageSquare } from 'lucide-react'

interface ArticleCardProps {
  title: string
  description: string
  author: {
    name: string
    image: string
    role?: string
  }
  date: string
  reactions: number
  comments: number
  tags?: string[]
}

export function ArticleCard({
  title,
  description,
  author,
  date,
  reactions,
  comments,
  tags = [],
}: ArticleCardProps) {
  return (
    <div className="border-y sm:border sm:rounded-lg mb-3 last:mb-0 sm:mb-4">
      <div className="p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={author.image} alt={author.name} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="#"
                className="font-medium hover:text-blue-600 truncate"
              >
                {author.name}
              </Link>
              {author.role && (
                <>
                  <span className="text-muted-foreground">for</span>
                  <span className="font-medium truncate">{author.role}</span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Link href="#" className="block">
            <h2 className="text-xl sm:text-2xl font-bold hover:text-blue-600 break-words">
              {title}
            </h2>
          </Link>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  className="text-sm text-muted-foreground hover:text-blue-600"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
          <p className="text-muted-foreground break-words">{description}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-8"
            >
              <ThumbsUp className="mr-1 h-4 w-4" />
              <span className="text-sm">{reactions} リアクション</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-8"
            >
              <MessageSquare className="mr-1 h-4 w-4" />
              <span className="text-sm">{comments} コメント</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
