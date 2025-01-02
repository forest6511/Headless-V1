export const PostStatuses = [
  { value: 'DRAFT', label: '下書き' },
  { value: 'PUBLISHED', label: '公開済み' },
] as const

export const Languages = [
  { value: 'ja', label: '日本語' },
  { value: 'en', label: '英語' },
] as const

export type Language = (typeof Languages)[number]['value']
