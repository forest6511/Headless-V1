// components/features/contact/contact-form.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Dictionary, Locale } from '@/types/i18n'

type ContactFormProps = {
  dictionary: Dictionary
  lang: Locale
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

type ValidationErrors = {
  name?: string
  email?: string
  message?: string
}

export function ContactForm({ dictionary, lang }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false)

  useEffect(() => {
    const initializeRecaptcha = async () => {
      try {
        if (typeof window === 'undefined') {
          console.log('Window is undefined')
          return
        }

        const waitForGrecaptcha = () => {
          return new Promise<void>((resolve, reject) => {
            if (window.grecaptcha) {
              console.log('reCAPTCHA object found, initializing...')
              window.grecaptcha.ready(() => {
                console.log('reCAPTCHA initialized successfully')
                resolve()
              })
            } else {
              console.log('reCAPTCHA object not found, retrying...')
              const timeoutId = setTimeout(() => {
                waitForGrecaptcha().then(resolve).catch(reject)
              }, 100)

              setTimeout(() => {
                clearTimeout(timeoutId)
                reject(new Error('reCAPTCHA initialization timeout'))
              }, 10000)
            }
          })
        }

        await waitForGrecaptcha()
        setIsRecaptchaLoaded(true)
        console.log('reCAPTCHA ready for use')
      } catch (error) {
        console.error('Failed to initialize reCAPTCHA:', error)
        setIsRecaptchaLoaded(false)
        setStatus('error')
        setStatusMessage(dictionary.contactUs.errors.recaptchaNotInitialized)
      }
    }

    initializeRecaptcha()
  }, [dictionary.contactUs.errors.recaptchaNotInitialized])

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    // 名前のバリデーション
    if (!formData.name.trim()) {
      newErrors.name = dictionary.contactUs.validation.nameRequired
    } else if (formData.name.length > 50) {
      newErrors.name = dictionary.contactUs.validation.nameTooLong
    }

    // メールアドレスのバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = dictionary.contactUs.validation.emailRequired
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = dictionary.contactUs.validation.emailInvalid
    }

    // メッセージのバリデーション
    if (!formData.message.trim()) {
      newErrors.message = dictionary.contactUs.validation.messageRequired
    } else if (formData.message.length < 10) {
      newErrors.message = dictionary.contactUs.validation.messageTooShort
    } else if (formData.message.length > 1000) {
      newErrors.message = dictionary.contactUs.validation.messageTooLong
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!isRecaptchaLoaded) {
      setStatus('error')
      setStatusMessage(
        'reCAPTCHA の読み込みに失敗しました。ページを更新してください。'
      )
      return
    }

    setStatus('loading')
    setStatusMessage(dictionary.contactUs.sending)

    try {
      console.log('Attempting to execute reCAPTCHA...')
      let token: string | undefined

      if (!window.grecaptcha) {
        console.error('reCAPTCHA not loaded')
        throw new Error(dictionary.contactUs.errors.recaptchaNotInitialized)
      }

      try {
        token = await window.grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
          { action: 'submit' }
        )
        console.log('reCAPTCHA token obtained:', token.substring(0, 10) + '...')
      } catch (recaptchaError) {
        console.error('reCAPTCHA execution error:', recaptchaError)
        throw new Error(dictionary.contactUs.errors.recaptchaFailed)
      }

      if (!token) {
        console.error('No reCAPTCHA token obtained')
        throw new Error(dictionary.contactUs.errors.recaptchaFailed)
      }

      const response = await fetch(`/api/${lang}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          recaptchaToken: token,
          lang,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fail to submit')
      }

      setStatus('success')
      setStatusMessage(data.message)
      setFormData({ name: '', email: '', message: '' })
      setErrors({})
    } catch (error) {
      console.error('Form submission error:', error)
      setStatus('error')
      setStatusMessage(
        error instanceof Error
          ? error.message
          : '送信に失敗しました。しばらく経ってから再度お試しください。'
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">{dictionary.contactUs.name}</label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <label htmlFor="email">{dictionary.contactUs.email}</label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          required
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>
      <div>
        <label htmlFor="message">{dictionary.contactUs.message}</label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
          required
          className={`w-full p-2 border rounded ${
            errors.message ? 'border-red-500' : ''
          }`}
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message}</p>
        )}
      </div>
      {/* ステータスメッセージの表示 */}
      {status !== 'idle' && statusMessage && ( // statusMessageが存在する場合のみ表示
        <div
          className={`p-4 rounded ${
            status === 'success'
              ? 'bg-green-100 text-green-700'
              : status === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-100 text-blue-700'
          }`}
        >
          {statusMessage}
        </div>
      )}
      <input type="hidden" name="lang" value={lang} />
      <Button
        type="submit"
        disabled={status === 'loading' || !isRecaptchaLoaded}
        className={`${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {status === 'loading'
          ? dictionary.contactUs.sending
          : !isRecaptchaLoaded
            ? dictionary.contactUs.recaptchaLoading
            : dictionary.button.submit}
      </Button>
    </form>
  )
}
