import Link from 'next/link'
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card'
import { Button } from '@nextui-org/button'
import { Chip } from '@nextui-org/chip'
import { Heart, MessageCircle } from 'lucide-react'

interface ArticleCardProps {
  category: string
  date: string
  title: string
  tags: string[]
  likes: number
  comments: number
  readTime: string
}

export function ArticleCard({
  category,
  date,
  title,
  tags,
  likes,
  comments,
  readTime,
}: ArticleCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-small text-default-500">{category}</p>
          <p className="text-small text-default-500">{date}</p>
        </div>
      </CardHeader>
      <CardBody>
        <Link
          href="/article/1"
          className="text-large font-bold hover:text-blue-500"
        >
          {title}
        </Link>
        <div className="flex gap-2 mt-2 flex-wrap">
          {tags.map((tag) => (
            <Chip key={tag} size="sm" variant="flat">
              #{tag}
            </Chip>
          ))}
        </div>
      </CardBody>
      <CardFooter className="gap-3">
        <Button variant="light" size="sm" startContent={<Heart size={16} />}>
          {likes}
        </Button>
        <Button
          variant="light"
          size="sm"
          startContent={<MessageCircle size={16} />}
        >
          {comments}
        </Button>
        <span className="ml-auto text-small text-default-500">{readTime}</span>
      </CardFooter>
    </Card>
  )
}
