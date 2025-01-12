export const Languages = [
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
] as const

export type Language = (typeof Languages)[number]['value']

export function parseLanguage(
  value: string,
  fallback: Language = 'ja'
): Language {
  const foundLanguage = Languages.find((lang) => lang.value === value)
  return foundLanguage ? foundLanguage.value : fallback
}
