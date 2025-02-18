// hooks/contact/useRecaptcha.ts
'use client'

import { useState, useEffect } from 'react'

type RecaptchaHook = {
  isRecaptchaLoaded: boolean
  error: string | null
  executeRecaptcha: (siteKey: string) => Promise<string | null>
}

export function useRecaptcha(
  errorMessage: string,
  lang?: string
): RecaptchaHook {
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeRecaptcha = async () => {
      try {
        if (typeof window === 'undefined') return

        // 既存のreCAPTCHAスクリプトを削除
        const existingScript = document.querySelector(
          'script[src^="https://www.google.com/recaptcha/api.js"]'
        )
        if (existingScript) {
          existingScript.remove()
        }

        // 新しいreCAPTCHAスクリプトを動的に追加
        const script = document.createElement('script')
        script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
        script.async = true
        document.body.appendChild(script)

        await new Promise<void>((resolve, reject) => {
          script.onload = () => {
            window.grecaptcha.ready(() => {
              console.log('reCAPTCHA initialized successfully')
              setIsRecaptchaLoaded(true)
              setError(null)
              resolve()
            })
          }

          script.onerror = () => {
            console.error('Failed to load reCAPTCHA script')
            setIsRecaptchaLoaded(false)
            setError(errorMessage)
            reject(new Error('reCAPTCHA script load failed'))
          }

          // 10秒でタイムアウト
          setTimeout(() => {
            reject(new Error('reCAPTCHA initialization timeout'))
          }, 10000)
        })
      } catch (err) {
        console.error('Failed to initialize reCAPTCHA:', err)
        setIsRecaptchaLoaded(false)
        setError(errorMessage)
      }
    }

    initializeRecaptcha()
  }, [errorMessage, lang])

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
