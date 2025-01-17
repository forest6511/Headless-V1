import { type Locale } from '@/types/i18n'
import { Category } from '@/types/category'
import { getCacheOptions } from '@/lib/fetchOptions'

export async function getCategories(lang: Locale): Promise<Category[]> {
  const res = await fetch(
    `${process.env.API_BASE_URL}/api/client/categories?language=${lang}`,
    {
      ...getCacheOptions(),
      headers: {
        Accept: 'application/json',
      },
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`)
  }

  return res.json()
}
