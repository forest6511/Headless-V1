export const PostStatuses = [
  {
    value: 'DRAFT',
    labels: {
      ja: '下書き',
      en: 'Draft',
    },
  },
  {
    value: 'PUBLISHED',
    labels: {
      ja: '公開済み',
      en: 'Published',
    },
  },
] as const

// 言語に応じたラベルを取得するヘルパー関数
export function getStatusLabel(status: string, language: 'ja' | 'en' = 'ja') {
  const foundStatus = PostStatuses.find((s) => s.value === status)
  return foundStatus ? foundStatus.labels[language] : status
}
