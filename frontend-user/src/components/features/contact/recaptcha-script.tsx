// components/features/contact/recaptcha-script.tsx
'use client'

import Script from 'next/script'

export function RecaptchaScript() {
  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
      strategy="afterInteractive"
      onLoad={() => {
        console.log('reCAPTCHA script loaded successfully')
      }}
      onError={(e) => {
        console.error('reCAPTCHA script failed to load:', e)
      }}
    />
  )
}
