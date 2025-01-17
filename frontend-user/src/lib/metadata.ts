// lib/metadata.ts
import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { type Locale } from '@/types/i18n'

export async function getMetadata(props: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  try {
    const { lang } = await Promise.resolve(props.params)
    const i18n = siteConfig.i18n[lang] || siteConfig.i18n['ja']

    return {
      title: {
        default: i18n.title,
        template: `%s | ${i18n.title}`,
      },
      description: i18n.description,
      // SEO最適化
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      // Open Graph対応
      openGraph: {
        title: i18n.title,
        description: i18n.description,
        locale: lang,
        type: 'website',
      },
      // Twitter Card対応
      twitter: {
        card: 'summary_large_image',
        title: i18n.title,
        description: i18n.description,
      },
      // 代替言語の指定
      alternates: {
        languages: {
          ja: '/ja',
          en: '/en',
        },
      },
    }
  } catch {
    return {
      title: 'Tech Blog',
      description: 'Technology Information Blog',
    }
  }
}
