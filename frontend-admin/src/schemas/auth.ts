import { z } from 'zod'

export const signupSchema = z
  .object({
    email: z.string().email('有効なメールアドレスを入力してください'),
    password: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください')
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, '英数字を含める必要があります'),
    confirmPassword: z.string(),
    nickname: z
      .string()
      .min(3, 'ニックネームは3文字以上で入力してください')
      .max(50, 'ニックネームは50文字以下で入力してください'),
    language: z.enum(['ja', 'en'], {
      errorMap: () => ({
        message: '言語は「ja」または「en」を選択してください',
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  })

export const signInSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
})

export type SigninFormData = z.infer<typeof signInSchema>
export type SignupFormData = z.infer<typeof signupSchema>
