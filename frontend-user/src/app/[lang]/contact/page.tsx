// app/[lang]/contact/page.tsx
import { ContactForm } from '@/components/features/contact/contact-form'
import { RecaptchaScript } from '@/components/features/contact/recaptcha-script'
import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/types/i18n'

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export default async function ContactPage(props: PageProps) {
  const params = await props.params
  const { lang } = params
  const dictionary = await getDictionary(lang)

  return (
    <>
      <RecaptchaScript />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">
          {dictionary.common.contactUs}
        </h1>
        <ContactForm dictionary={dictionary} lang={params.lang} />
      </div>
    </>
  )
}
