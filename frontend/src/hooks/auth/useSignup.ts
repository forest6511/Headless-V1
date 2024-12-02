import { useState } from 'react'
import { authApi } from '@/lib/api/auth'
import type { SignupPayload } from '@/types/request'

export const useSignup = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const signup = async (payload: SignupPayload) => {
    setLoading(true)
    setError(null)

    try {
      return await authApi.signup(payload)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Signup failed'))
      throw err
    } finally {
      setLoading(false)
    }
  }
  return { signup, loading, error }
}
