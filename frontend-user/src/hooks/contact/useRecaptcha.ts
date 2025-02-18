// hooks/contact/useRecaptcha.ts
'use client'

import { useState, useEffect } from 'react'

type RecaptchaHook = {
  isRecaptchaLoaded: boolean
  error: string | null
  executeRecaptcha: (siteKey: string) => Promise<string | null>
}

export function useRecaptcha(errorMessage: string): RecaptchaHook {
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeRecaptcha = async () => {
      try {
        if (typeof window === 'undefined') return

        await new Promise<void>((resolve, reject) => {
          const waitForGrecaptcha = () => {
            if (window.grecaptcha) {
              window.grecaptcha.ready(() => {
                console.log('reCAPTCHA initialized successfully')
                resolve()
              })
            } else {
              setTimeout(waitForGrecaptcha, 100)
            }
          }

          waitForGrecaptcha()

          // 5秒でタイムアウト
          setTimeout(() => {
            reject(new Error('reCAPTCHA initialization timeout'))
          }, 5000)
        })

        setIsRecaptchaLoaded(true)
        setError(null)
      } catch (err) {
        console.error('Failed to initialize reCAPTCHA:', err)
        setIsRecaptchaLoaded(false)
        setError(errorMessage)
      }
    }

    initializeRecaptcha()
  }, [errorMessage])

  const executeRecaptcha = async (siteKey: string): Promise<string | null> => {
    if (!isRecaptchaLoaded || !window.grecaptcha) {
      console.warn('reCAPTCHA not loaded or not ready')
      return null
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, {
        action: 'submit',
      })
      console.log('reCAPTCHA token obtained successfully')
      return token
    } catch (recaptchaError) {
      console.error('reCAPTCHA execution error:', recaptchaError)
      return null
    }
  }

  return {
    isRecaptchaLoaded,
    error,
    executeRecaptcha,
  }
}
