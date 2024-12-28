import Link from 'next/link'

interface TagListProps {
  tags?: string[]
}

export function TagList({ tags }: TagListProps) {
  if (tags === undefined || tags.length === 0) {
    return null
  }

  return (
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
  )
}
