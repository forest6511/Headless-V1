'use client'

// components/features/navigation/components/language-switch.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { Locale } from '@/types/i18n'

interface LanguageSwitchProps {
  currentLang: Locale
}

export function LanguageSwitch({ currentLang }: LanguageSwitchProps) {
  const router = useRouter()

  return (
    <Select
      defaultValue={currentLang}
      onValueChange={(value) => router.push(`/${value}`)}
    >
      <SelectTrigger className="w-32" aria-label="Language selector">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ja">Japanese</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  )
}
