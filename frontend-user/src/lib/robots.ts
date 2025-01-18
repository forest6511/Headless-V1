// lib/robots.ts
import { MetadataRoute } from 'next'
import { LOCALES } from '@/types/i18n'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_CLIENT_URL

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          ...LOCALES.map(locale => `/${locale}/articles/`)
        ],
        disallow: ['/api/']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  }
}