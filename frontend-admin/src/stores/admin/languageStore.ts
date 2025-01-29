import { Language, Languages } from '@/types/api/common/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LanguageStore {
  language: Language
  setLanguage: (language: Language) => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: Languages[0].value,
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'language-storage',
      skipHydration: true, // これを追加
    }
  )
)
