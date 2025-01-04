import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
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
      onValueChange={(value) => onLanguageChange(value as Language)}
      defaultValue={currentLanguage}
    >
      <SelectTrigger className="w-32">
        <SelectValue placeholder="言語を選択" />
      </SelectTrigger>
      <SelectContent>
        {Languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
