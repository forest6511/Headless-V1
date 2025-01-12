'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import { createSignupSchema, SignupFormData } from '@/schemas/auth'
import { authApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { LanguageSelector } from '@/components/common/LanguageSelector'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'
import { useEffect } from 'react'

export default function SignUpForm() {
  const currentLanguage = useLanguageStore((state) => state.language)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(createSignupSchema(currentLanguage)),
    defaultValues: {
      language: currentLanguage,
    },
  })

  // 言語が変更されたら、フォームの言語も更新
  useEffect(() => {
    setValue('language', currentLanguage)
  }, [currentLanguage, setValue])

  const onSubmit = async (data: SignupFormData) => {
    try {
      await authApi.signup({
        email: data.email,
        password: data.password,
        nickname: data.nickname,
        language: data.language,
      })
      toast.success(t(currentLanguage, 'auth.submit'))
    } catch (error) {
      console.error('Signup failed:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <LanguageSelector />
      <Input
        {...register('nickname')}
        label={t(currentLanguage, 'auth.label.nickname')}
        placeholder={t(currentLanguage, 'auth.placeholders.nickname')}
        isInvalid={!!errors.nickname}
        errorMessage={errors.nickname?.message}
      />
      <Input
        {...register('email')}
        label={t(currentLanguage, 'auth.label.email')}
        placeholder={t(currentLanguage, 'auth.placeholders.email')}
        type="email"
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
      />
      <Input
        {...register('password')}
        label={t(currentLanguage, 'auth.label.password')}
        placeholder={t(currentLanguage, 'auth.placeholders.password')}
        type="password"
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
      />
      <Input
        {...register('confirmPassword')}
        label={t(currentLanguage, 'auth.label.confirmPassword')}
        placeholder={t(currentLanguage, 'auth.placeholders.confirmPassword')}
        type="password"
        isInvalid={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword?.message}
      />
      <Button type="submit" color="primary" className="w-full">
        {t(currentLanguage, 'auth.submit')}
      </Button>
    </form>
  )
}
