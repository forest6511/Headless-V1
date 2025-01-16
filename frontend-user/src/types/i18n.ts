export const LOCALES = ['ja', 'en'] as const
export type Locale = (typeof LOCALES)[number]

// デフォルトロケールも定数として定義
export const DEFAULT_LOCALE: Locale = 'ja'

// 言語コードと言語名の対応
export const LOCALE_NAMES: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
} as const
