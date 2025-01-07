'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import { SigninFormData, signInSchema } from '@/schemas/auth'
import { authApi } from '@/lib/api'
import { ROUTES } from '@/config/routes'
import { useRouter } from 'next/router'
import React from 'react'

export default function SignInForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
  })


  const onSubmit: SubmitHandler<SigninFormData> = async (data) => {
    try {
      const response = await authApi.signin({
        email: data.email,
        password: data.password,
      })

      router.push(ROUTES.DASHBOARD.BASE)
    } catch (error) {
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
      <Button type="submit" color="primary" className="w-full">
        ログイン
      </Button>
    </form>
  )
}
