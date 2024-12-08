'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import { SignupFormData, signupSchema } from '@/schemas/auth'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'

export default function SignUpForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    console.log(data)
    try {
      authApi.signup({
        email: data.email,
        password: data.password,
      })

      // TODO メール確認などは省略。将来的にサインアップ機能は削除予定(バックエンドのデプロイ前)
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Signup failed:', error)
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
      <Input
        {...register('confirmPassword')}
        label="パスワード（確認）"
        placeholder="パスワードを再入力"
        type="password"
        isInvalid={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword?.message}
      />
      <Button type="submit" color="primary" className="w-full">
        サインアップ
      </Button>
    </form>
  )
}
