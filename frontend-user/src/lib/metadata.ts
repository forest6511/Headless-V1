// lib/metadata.ts
import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { type Locale } from '@/types/i18n'

type MetadataOptions = {
  title?: string
  description?: string
}

export async function getMetadata(props: {
  params: { lang: Locale } | Promise<{ lang: Locale }>
  options?: MetadataOptions
}): Promise<Metadata> {
  try {
    // パラメータが Promise の場合は await で解決
    const params = await Promise.resolve(props.params)
    const { lang } = params

    const i18n = siteConfig.i18n[lang] || siteConfig.i18n['ja']
    const { title, description } = props.options || {}

    const resolvedTitle = title || i18n.title
    const resolvedDescription = description || i18n.description

    return {
      title: {
        default: resolvedTitle,
        template: `%s | ${resolvedTitle}`,
      },
      description: resolvedDescription,
      // 以下は前回と同じ
    }
  } catch {
    return {
      title: 'Tech Blog',
      description: 'Technology Information Blog',
    }
  }
}
