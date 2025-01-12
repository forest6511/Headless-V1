import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Language, Languages } from '@/types/api/common/types'
import { useLanguageStore } from '@/stores/admin/languageStore'

export function LanguageSelector() {
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)

  return (
    <Select
      onValueChange={(value) => setLanguage(value as Language)}
      defaultValue={language}
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
