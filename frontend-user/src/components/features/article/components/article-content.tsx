import Link from 'next/link'
import { TagList } from '@/components/features/article/components/tag-list'

interface ArticleContentProps {
  lang: string
  title: string
  slug: string
  description: string
  tags: string[]
  category: {
    path: {
      slug: string
      name: string
    }[]
  }
}

export function ArticleContent({
  lang,
  title,
  slug,
  description,
  tags,
  category,
}: ArticleContentProps) {
  return (
    <div className="space-y-2">
      <Link href={`/${lang}/articles/${slug}`} className="block">
        <h2 className="text-xl sm:text-2xl font-bold hover:text-blue-600 break-words">
          {title}
        </h2>
      </Link>
      <TagList category={category} tags={tags} />
      <p className="text-muted-foreground break-words">{description}</p>
    </div>
  )
}
