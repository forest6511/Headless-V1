import jaMessages from '@/messages/ja.json'
import enMessages from '@/messages/en.json'
import { Language } from '@/types/api/common/types'

const messages = {
  ja: jaMessages,
  en: enMessages,
}

export function t(language: Language, path: string): string {
  return path.split('.').reduce((obj: any, key) => obj[key], messages[language])
}
