import Link from 'next/link'
import { TagList } from '@/components/features/article/components/tag-list'
import { FeaturedImage } from '@/types/article'

interface ArticleContentProps {
  lang: string
  title: string
  slug: string
  description: string
  tags: string[]
  featuredImage?: FeaturedImage
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
  featuredImage,
  category,
}: ArticleContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {featuredImage && (
          <div className="flex-none w-32 h-32 sm:w-32 sm:h-32">
            <Link href={`/${lang}/articles/${slug}`}>
              <img
                src={featuredImage.thumbnailUrl || '/placeholder.svg'}
                alt={featuredImage.translations[0]?.title || title}
                className="w-full h-full object-cover rounded-lg"
                decoding="async"
                fetchPriority="low"
              />
            </Link>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <Link href={`/${lang}/articles/${slug}`}>
            <h2 className="text-xl sm:text-2xl font-bold hover:text-blue-600 break-anywhere">
              {title}
            </h2>
          </Link>
          <div className="mt-2">
            <TagList category={category} tags={tags} lang={lang} />
          </div>
        </div>
      </div>

      <p className="text-muted-foreground break-anywhere">{description}</p>
    </div>
  )
}
