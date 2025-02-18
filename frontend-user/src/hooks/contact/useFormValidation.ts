// hooks/contact/useFormValidation.ts
'use client'

import { useState } from 'react'
import type { Dictionary } from '@/types/i18n'

type FormData = {
  name: string
  email: string
  message: string
}

type ValidationErrors = {
  name?: string
  email?: string
  message?: string
}

export function useFormValidation(dictionary: Dictionary) {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validateForm = (formData: FormData): boolean => {
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

  const resetErrors = () => {
    setErrors({})
  }

  return {
    errors,
    validateForm,
    resetErrors,
  }
}
