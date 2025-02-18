// /types/i18n.ts
export const LOCALES = ['ja', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'ja'

export const LOCALE_NAMES: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
} as const

export type Dictionary = {
  home: {
    latestArticles: string
  }
  common: {
    home: string
    articles: string
    notFound: string
    lastUpdated: string
    fetchError: string
    contactUs: string
  }
  button: {
    submit: string
  }
  contactUs: {
    name: string
    email: string
    message: string
    sending: string
    recaptchaLoading: string
    validation: {
      nameRequired: string
      nameTooLong: string
      emailRequired: string
      emailInvalid: string
      messageRequired: string
      messageTooShort: string
      messageTooLong: string
    }
    errors: {
      recaptchaRequired: string
      recaptchaNotInitialized: string
      recaptchaFailed: string
      requiredFields: string
      unexpected: string
      submitFailed: string
    }
    success: string
    emailSubject: string
  }
}
