import { Select, SelectItem } from '@nextui-org/react'
import { Language, Languages } from '@/types/api/post/types'

interface LanguageSelectorProps {
  currentLanguage: Language
  onLanguageChange: (language: Language) => void
}

export function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  return (
    <Select
      label="言語"
      value={currentLanguage}
      onChange={(e) => onLanguageChange(e.target.value as Language)}
      className="w-32"
      defaultSelectedKeys={['ja']}
    >
      {Languages.map((lang) => (
        <SelectItem key={lang.value} value={lang.value}>
          {lang.label}
        </SelectItem>
      ))}
    </Select>
  )
}
