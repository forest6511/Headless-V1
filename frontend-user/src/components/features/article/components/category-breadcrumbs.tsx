// components/features/article/navigation/components/category-breadcrumbs.tsx
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { type Locale } from '@/types/i18n'
import { type CategoryPath } from '@/types/category'

type Props = {
  lang: Locale
  categoryPath: CategoryPath
}

export function CategoryBreadcrumbs({ lang, categoryPath }: Props) {
  return (
    <>
      {categoryPath.map((cat, index) => {
        const categoryPathString = categoryPath
          .slice(0, index + 1)
          .map((c) => c.slug)
          .join('/')

        return (
          <li key={cat.slug}>
            <Link
              href={`/${lang}/categories/${categoryPathString}`}
              className="hover:text-foreground"
            >
              {cat.name}
            </Link>
            {index < categoryPath.length - 1 && (
              <ChevronRight
                className="h-4 w-4 inline ml-2"
                aria-hidden="true"
              />
            )}
          </li>
        )
      })}
    </>
  )
}