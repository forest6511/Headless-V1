'use client'

import { useEffect } from 'react'
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

  useEffect(() => {
    const stored = localStorage.getItem('language-storage')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.state && parsed.state.language) {
          setLanguage(parsed.state.language)
        }
      } catch (e) {
        console.error('Failed to parse stored language:', e)
      }
    }
  }, [setLanguage])

  return (
    <Select
      value={language}
      onValueChange={(value) => setLanguage(value as Language)}
    >
      <SelectTrigger className="w-32 text-black bg-gray-100">
        <SelectValue placeholder="言語を選択" />
      </SelectTrigger>
      <SelectContent className="bg-gray-100 border-black text-black">
        {Languages.map((lang) => (
          <SelectItem
            key={lang.value}
            value={lang.value}
            className="hover:bg-gray-200 focus:bg-gray-200"
          >
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
