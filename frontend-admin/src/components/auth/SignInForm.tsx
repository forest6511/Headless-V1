'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import { createSignInSchema, SigninFormData } from '@/schemas/auth'
import { authApi } from '@/lib/api'
import { ROUTES } from '@/config/routes'
import { useRouter } from 'next/navigation'
import React from 'react'
import { ApiError } from '@/lib/api/core/client'
import { userStore } from '@/stores/admin/userStore'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'
import { parseLanguage } from '@/types/api/common/types'

export default function SignInForm() {
  const router = useRouter()
  const setUser = userStore((state) => state.setUser)
  const setLanguage = useLanguageStore((state) => state.setLanguage)

  const currentLanguage = useLanguageStore((state) => state.language)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(createSignInSchema(currentLanguage)),
  })

  const onSubmit = async (data: SigninFormData) => {
    try {
      const response = await authApi.signin({
        email: data.email,
        password: data.password,
      })

      setUser(response.nickname, response.thumbnailUrl)
      setLanguage(parseLanguage(response.language))
      router.push(ROUTES.DASHBOARD.BASE)
    } catch (error) {
      if (error instanceof ApiError) {
        setError('root', {
          type: 'manual',
          message: t(currentLanguage, 'auth.validation.signinFailed'),
        })
      }
      console.error('Signin failed:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
      {errors.root && (
        <div className="text-sm text-danger px-1">{errors.root.message}</div>
      )}
      <Button type="submit" color="primary" className="w-full">
        {t(currentLanguage, 'auth.submit')}
      </Button>
    </form>
  )
}
