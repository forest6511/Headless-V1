'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import { SigninFormData, signInSchema } from '@/schemas/auth'
import { authApi } from '@/lib/api'
import { ROUTES } from '@/config/routes'
import { useRouter } from 'next/navigation'
import React from 'react'
import { ApiError } from '@/lib/api/core/client'
import { userStore } from '@/stores/admin/userStore'

export default function SignInForm() {
  const router = useRouter()
  const setUser = userStore((state) => state.setUser)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SigninFormData) => {
    try {
      const response = await authApi.signin({
        email: data.email,
        password: data.password,
      })

      setUser(response.nickname, response.thumbnailUrl, response.language)
      router.push(ROUTES.DASHBOARD.BASE)
    } catch (error) {
      if (error instanceof ApiError) {
        setError('root', {
          type: 'manual',
          message: 'メールアドレスまたはパスワードが正しくありません。',
        })
      }
      console.error('Signin failed:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('email')}
        label="メールアドレス"
        placeholder="example@example.com"
        type="email"
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
      />
      <Input
        {...register('password')}
        label="パスワード"
        placeholder="パスワードを入力"
        type="password"
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
      />
      {errors.root && (
        <div className="text-sm text-danger px-1">{errors.root.message}</div>
      )}
      <Button type="submit" color="primary" className="w-full">
        ログイン
      </Button>
    </form>
  )
}
