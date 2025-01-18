// /lib/i18n/dictionaries/index.ts
import { DEFAULT_LOCALE, type Locale } from '@/types/i18n'

const dictionaries = {
  en: () => import('./en.json'),
  ja: () => import('./ja.json'),
} as const

export const getDictionary = async (locale: Locale) => {
  const importDictionary = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE]
  try {
    return (await importDictionary()).default
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${locale}`, error)
    return (await dictionaries[DEFAULT_LOCALE]()).default
  }
}
