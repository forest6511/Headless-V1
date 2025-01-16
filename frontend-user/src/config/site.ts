import {
  LOCALES,
  type Locale,
  DEFAULT_LOCALE,
  LOCALE_NAMES,
} from '@/types/i18n'

export const siteConfig = {
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,

  i18n: {
    ja: {
      name: LOCALE_NAMES.ja,
      title: 'テックブログ',
      description: '最新のテクノロジー情報をお届けします',
      nav: {
        home: 'ホーム',
        articles: '記事一覧',
        about: '私たちについて',
      },
    },
    en: {
      name: LOCALE_NAMES.en,
      title: 'Tech Blog',
      description: 'Delivering the latest technology information',
      nav: {
        home: 'Home',
        articles: 'Articles',
        about: 'About',
      },
    },
  },

  // サイト全体で共通の設定
  site: {
    copyright: '© 2025 Tech Blog',
    social: {
      twitter: 'https://twitter.com/example',
      github: 'https://github.com/example',
    },
  },
} as const

// generateStaticParamsのユーティリティ関数
export function getStaticParams() {
  return LOCALES.map((lang) => ({
    lang,
  }))
}

// 型ヘルパー
export type I18nConfig = (typeof siteConfig.i18n)[Locale]
