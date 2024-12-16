'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { ROUTES } from '@/config/routes'

export function useTokenRefresh() {
  const router = useRouter()
  const refreshInProgress = useRef(false)

  const checkAndRefreshToken = async () => {
    if (refreshInProgress.current) return
    refreshInProgress.current = true

    try {
      const authResponse = await authApi.refresh()

      if (!authResponse) {
        console.error('[ERROR] Token refresh failed, redirecting to /')
        router.push(ROUTES.HOME)
        return
      }
    } catch (error) {
      console.error('[ERROR] Token refresh failed with exception:', error)
    } finally {
      refreshInProgress.current = false
    }
  }

  useEffect(() => {
    // 25分間隔でトークンをリフレッシュ
    const intervalId = setInterval(checkAndRefreshToken, 25 * 60 * 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [router])
}
