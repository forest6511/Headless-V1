import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ArticleHeaderProps {
  author: {
    name: string
    image: string
  }
  date: string
}

export function ArticleHeader({ author, date }: ArticleHeaderProps) {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={author.image} alt={author.name} />
        <AvatarFallback>{author.name[0]}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="#" className="font-medium hover:text-blue-600 truncate">
            {author.name}
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>
    </div>
  )
}
