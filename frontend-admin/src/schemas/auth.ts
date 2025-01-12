import { z } from 'zod'
import { Language } from '@/types/api/common/types'
import { t } from '@/lib/translations'

export const createSignupSchema = (language: Language) =>
  z
    .object({
      email: z.string().email(t(language, 'auth.validation.email')),
      password: z
        .string()
        .min(8, t(language, 'auth.validation.passwordLength'))
        .regex(
          /^(?=.*[A-Za-z])(?=.*\d)/,
          t(language, 'auth.validation.passwordFormat')
        ),
      confirmPassword: z.string(),
      nickname: z
        .string()
        .min(3, t(language, 'auth.validation.nicknameMin'))
        .max(50, t(language, 'auth.validation.nicknameMax')),
      language: z.enum(['ja', 'en'], {
        errorMap: () => ({
          message: t(language, 'auth.validation.languageInvalid'),
        }),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t(language, 'auth.validation.passwordConfirm'),
      path: ['confirmPassword'],
    })

export const createSignInSchema = (language: Language) =>
  z.object({
    email: z.string().email(t(language, 'auth.validation.email')),
    password: z.string().min(8, t(language, 'auth.validation.passwordLength')),
  })

// デフォルトスキーマ（日本語）
export const signupSchema = createSignupSchema('ja')
export const signInSchema = createSignInSchema('ja')

export type SigninFormData = z.infer<typeof signInSchema>
export type SignupFormData = z.infer<typeof signupSchema>
