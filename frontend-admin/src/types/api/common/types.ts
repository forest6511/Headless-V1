export const Languages = [
  { value: 'ja', label: '日本語' },
  { value: 'en', label: '英語' },
] as const

export type Language = (typeof Languages)[number]['value']

export function parseLanguage(
  value: string,
  fallback: Language = 'ja'
): Language {
  const foundLanguage = Languages.find((lang) => lang.value === value)
  return foundLanguage ? foundLanguage.value : fallback
}
