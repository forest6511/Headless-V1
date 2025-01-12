import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserStore {
  nickname: string | null
  thumbnailUrl: string | null
  language: string | null
  setUser: (nickname: string, thumbnailUrl: string, language: string) => void
  clearUser: () => void
}

export const userStore = create<UserStore>()(
  persist(
    (set) => ({
      nickname: null,
      thumbnailUrl: null,
      language: null,
      setUser: (nickname, thumbnailUrl, language) =>
        set({ nickname, thumbnailUrl, language }),
      clearUser: () =>
        set({ nickname: null, thumbnailUrl: null, language: null }),
    }),
    {
      // ストレージのキー
      name: 'user-storage',
    }
  )
)
