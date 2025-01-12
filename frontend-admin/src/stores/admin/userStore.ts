import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserStore {
  nickname: string | null
  thumbnailUrl: string | null
  language: string | null
  setUser: (nickname: string, thumbnailUrl: string) => void
  clearUser: () => void
}

export const userStore = create<UserStore>()(
  persist(
    (set) => ({
      nickname: null,
      thumbnailUrl: null,
      language: null,
      setUser: (nickname, thumbnailUrl) => set({ nickname, thumbnailUrl }),
      clearUser: () => set({ nickname: null, thumbnailUrl: null }),
    }),
    {
      // ストレージのキー
      name: 'user-storage',
    }
  )
)
