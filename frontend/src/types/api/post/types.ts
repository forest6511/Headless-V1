export const PostStatuses = [
  { value: 'DRAFT', label: '下書き' },
  { value: 'PUBLISHED', label: '公開済み' },
] as const

// 'DRAFT' | 'PUBLISHED' 型を定義
export type StatusValue = (typeof PostStatuses)[number]['value']

// { value: 'DRAFT' | 'PUBLISHED'; label: string } 型を定義
export type Status = (typeof PostStatuses)[number]
