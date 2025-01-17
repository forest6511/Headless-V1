// lib/date.ts
import { type Locale } from '@/types/i18n'

type DateFormatOptions = {
  long?: boolean
}

export function formatDate(
  date: string,
  lang: Locale,
  options: DateFormatOptions = { long: true }
): string {
  const locale = lang === 'ja' ? 'ja-JP' : 'en-US'

  if (options.long) {
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return new Date(date).toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
  })
}

// ISO形式の日付文字列を生成（メタデータなどで使用）
export function toISODate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date)
  return d.toISOString()
}

// 人間が読みやすい相対時間を返す（「〇分前」など）
export function getRelativeTimeString(date: string, lang: Locale): string {
  const target = new Date(date).getTime()
  const now = Date.now()
  const diff = now - target

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (lang === 'ja') {
    if (days > 0) return `${days}日前`
    if (hours > 0) return `${hours}時間前`
    if (minutes > 0) return `${minutes}分前`
    return '今'
  } else {
    if (days > 0) return `${days} days ago`
    if (hours > 0) return `${hours} hours ago`
    if (minutes > 0) return `${minutes} minutes ago`
    return 'just now'
  }
}
