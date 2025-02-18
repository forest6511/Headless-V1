// components/features/contact/contact-form.tsx
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Dictionary, Locale } from '@/types/i18n'
import { useFormValidation } from '@/hooks/contact/useFormValidation'
import { useRecaptcha } from '@/hooks/contact/useRecaptcha'

type ContactFormProps = {
  dictionary: Dictionary
  lang: Locale
}

// 型定義を追加
type ValidationErrorKeys = 'form' | 'submit' | 'recaptcha'
type ValidationErrors = Record<ValidationErrorKeys, boolean>
type ErrorHandlers = Record<ValidationErrorKeys, () => void>

export function ContactForm({ dictionary, lang }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [canSubmit, setCanSubmit] = useState(true)
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [statusMessage, setStatusMessage] = useState<string>('')

  const { errors, validateForm, resetErrors } = useFormValidation(dictionary)
  const { isRecaptchaLoaded, executeRecaptcha } = useRecaptcha(
    dictionary.contactUs.errors.recaptchaNotInitialized
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 型付けされたバリデーションエラーオブジェクト
    const validationErrors: ValidationErrors = {
      form: !validateForm(formData),
      submit: !canSubmit,
      recaptcha: !isRecaptchaLoaded,
    }

    // 型付けされたエラーハンドラー
    const errorHandlers: ErrorHandlers = {
      form: () => {}, // フォームエラーは既にuseFormValidationで処理
      submit: () => {
        setStatus('error')
        setStatusMessage(dictionary.contactUs.errors.tooManyRequests)
      },
      recaptcha: () => {
        setStatus('error')
        setStatusMessage(dictionary.contactUs.errors.recaptchaNotInitialized)
      },
    }

    // エラーチェックと処理
    const errorKeys = (
      Object.keys(validationErrors) as ValidationErrorKeys[]
    ).filter((key) => validationErrors[key])

    if (errorKeys.length > 0) {
      errorKeys.forEach((key) => errorHandlers[key]())
      return
    }

    // 送信を5秒間無効化
    setCanSubmit(false)
    setTimeout(() => setCanSubmit(true), 5000)

    setStatus('loading')
    setStatusMessage(dictionary.contactUs.sending)

    try {
      const token = await executeRecaptcha(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!
      )

      if (!token) {
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
      resetErrors()
    } catch (error) {
      console.error('Form submission error:', error)
      setStatus('error')
      setStatusMessage(
        error instanceof Error
          ? error.message
          : dictionary.contactUs.errors.submitFailed
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
      {status !== 'idle' &&
        statusMessage && ( // statusMessageが存在する場合のみ表示
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
        disabled={status === 'loading' || !isRecaptchaLoaded || !canSubmit}
        className={`${
          status === 'loading' || !canSubmit
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
      >
        {status === 'loading'
          ? dictionary.contactUs.sending
          : !isRecaptchaLoaded
            ? dictionary.contactUs.recaptchaLoading
            : !canSubmit
              ? dictionary.contactUs.waitMessage
              : dictionary.button.submit}
      </Button>
    </form>
  )
}
