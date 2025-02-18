// app/api/[lang]/contact/route.ts
import { NextRequest } from 'next/server'
import { Resend } from 'resend'
import { ContactEmail } from '@/components/features/contact/email-template'
import { ReCaptchaResponse } from '@/types/recaptcha'
import { getDictionary } from '@/lib/i18n/dictionaries'

const resend = new Resend(process.env.RESEND_API_KEY)

async function verifyRecaptcha(token: string) {
  console.log(
    'Starting reCAPTCHA verification with token:',
    token.substring(0, 10) + '...'
  )
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    { method: 'POST' }
  )
  const data: ReCaptchaResponse = await response.json()
  console.log('reCAPTCHA verification response:', data)
  return data
}

export async function POST(request: NextRequest) {
  let submittedLang

  try {
    const { name, email, message, recaptchaToken, lang } = await request.json()
    submittedLang = lang // langを保存
    const dictionary = await getDictionary(submittedLang)

    if (!recaptchaToken) {
      return Response.json(
        { error: dictionary.contactUs.errors.recaptchaRequired },
        { status: 400 }
      )
    }

    const recaptchaResult = await verifyRecaptcha(recaptchaToken)
    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      console.log(JSON.stringify(recaptchaResult))
      return Response.json(
        { error: dictionary.contactUs.errors.recaptchaFailed },
        { status: 400 }
      )
    }

    if (!name || !email || !message) {
      return Response.json(
        { error: dictionary.contactUs.errors.requiredFields },
        { status: 400 }
      )
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || '',
      to: process.env.RESEND_TO_EMAIL || '',
      subject: dictionary.contactUs.emailSubject.replace('{name}', name),
      react: ContactEmail({ name, email, message, lang }),
    })

    return Response.json(
      {
        message: dictionary.contactUs.success,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    // デフォルトの言語を使用するか、送信された言語を使用
    const dictionary = await getDictionary(submittedLang)

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : dictionary.contactUs.errors.unexpected,
      },
      { status: 500 }
    )
  }
}
