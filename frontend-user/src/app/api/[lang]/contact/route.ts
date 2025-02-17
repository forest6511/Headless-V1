// app/api/contact/route.ts
import { Resend } from 'resend'
import { ContactEmail } from '@/components/features/contact/email-template'
import { ReCaptchaResponse } from '@/types/recaptcha'

const resend = new Resend(process.env.RESEND_API_KEY)

async function verifyRecaptcha(token: string) {
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    { method: 'POST' }
  )
  const data: ReCaptchaResponse = await response.json()
  return data
}

export async function POST(request: Request) {
  try {
    // フォームデータの取得
    const { name, email, message, lang, recaptchaToken } = await request.json()

    // reCAPTCHA検証
    const recaptchaResult = await verifyRecaptcha(recaptchaToken)
    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      return Response.json(
        { error: 'reCAPTCHA verification failed' },
        { status: 400 }
      )
    }

    // 必須フィールドのチェック
    if (!name || !email || !message || !lang) {
      return Response.json(
        { error: 'Name, email, message and language are required' },
        { status: 400 }
      )
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || '',
      to: process.env.RESEND_TO_EMAIL || '',
      subject:
        lang === 'ja'
          ? `新しいお問い合わせ: ${name}様より`
          : `New Contact Form Submission from ${name}`,
      react: ContactEmail({ name, email, message, lang }),
    })

    return Response.json(
      {
        message:
          lang === 'ja'
            ? 'お問い合わせを受け付けました'
            : 'Message sent successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    return Response.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
