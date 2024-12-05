'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api/client'
import type { AuthResponse } from '@/types/api/auth/response'

// TODO　テスト用
export function useTokenRefresh() {
  const router = useRouter()
  const refreshInProgress = useRef(false)

  const checkAndRefreshToken = async () => {
    if (refreshInProgress.current) {
      console.log('[DEBUG] Refresh already in progress')
      return
    }

    refreshInProgress.current = true
    try {
      console.log('[DEBUG] Sending refresh token request to server')

      const response = await apiClient.refreshToken()

      if (!response.ok) {
        console.error('[ERROR] Token refresh failed, redirecting to /admin')
        router.push('/admin') // リダイレクト
        return // 明示的に処理を終了
      }

      const authResponse: AuthResponse = await response.json()
      console.log('[INFO] Token refreshed successfully:', authResponse)
    } catch (error) {
      console.error('[ERROR] Token refresh failed with exception:', error)
    } finally {
      refreshInProgress.current = false
      console.log('[DEBUG] Refresh process completed')
    }
  }

  useEffect(() => {
    console.log('[DEBUG] Initializing token refresh check')

    const intervalId = setInterval(checkAndRefreshToken, 10 * 1000) // 10秒間隔でリフレッシュ
    return () => {
      clearInterval(intervalId)
      console.log('[DEBUG] Cleaning up refresh process')
    }
  }, [router])
}
