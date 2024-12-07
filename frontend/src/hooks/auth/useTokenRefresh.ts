'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/auth'

// TODO　テスト用
export function useTokenRefresh() {
  const router = useRouter()
  const refreshInProgress = useRef(false)

  const checkAndRefreshToken = async () => {
    if (refreshInProgress.current) return
    refreshInProgress.current = true

    try {
      const authResponse = await authApi.refresh()

      if (!authResponse) {
        console.error('[ERROR] Token refresh failed, redirecting to /admin')
        router.push('/admin')
        return
      }
    } catch (error) {
      console.error('[ERROR] Token refresh failed with exception:', error)
    } finally {
      refreshInProgress.current = false
    }
  }

  useEffect(() => {
    const intervalId = setInterval(checkAndRefreshToken, 10 * 1000) // 10秒間隔でリフレッシュ
    return () => {
      clearInterval(intervalId)
    }
  }, [router])
}
