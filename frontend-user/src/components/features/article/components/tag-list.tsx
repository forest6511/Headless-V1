import Link from 'next/link'

interface TagListProps {
  lang: string
  tags: string[]
  category: {
    path: {
      slug: string
      name: string
    }[]
  }
}

export function TagList({ tags, category, lang }: TagListProps) {
  // カテゴリの表示名を取得（最下層のカテゴリ名を使用）
  const categoryName = category?.path?.length
    ? category.path[category.path.length - 1].name
    : null

  // カテゴリのフルパスを構築
  const categoryPath = category?.path?.map((p) => p.slug)?.join('/') || ''

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {categoryName && (
        <Link
          href={`/${lang}/categories/${categoryPath}`}
          className="text-sm text-muted-foreground hover:text-blue-600"
        >
          {categoryName}
        </Link>
      )}
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
