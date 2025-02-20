// config/site.ts
import { LOCALES, DEFAULT_LOCALE, LOCALE_NAMES } from '@/types/i18n'

export const siteConfig = {
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  baseUrl: process.env.NEXT_CLIENT_URL || 'http://localhost:3005',
  i18n: {
    ja: {
      name: LOCALE_NAMES.ja,
      title: 'テック・旅・ライフ ジャーナル',
      description:
        'IT・旅行・生活情報を発信するブログ。最新のテクノロジーから世界各地の旅情報、日々のライフハックまで、エンジニア目線で深掘りします',
      nav: {
        home: 'ホーム',
        articles: '記事一覧',
        about: '私たちについて',
      },
    },
    en: {
      name: LOCALE_NAMES.en,
      title: 'Tech, Travel & Life Journal',
      description:
        'A blog about IT, travel, and life insights. From cutting-edge technology to global travel tips and daily life hacks, exploring the world through the lens of an engineer.',
      nav: {
        home: 'Home',
        articles: 'Articles',
        about: 'About',
      },
    },
  },

  site: {
    copyright: '© 2025 Tech Blog',
    social: {
      twitter: 'https://twitter.com/example',
      github: 'https://github.com/example',
    },
  },
} as const
