// components/features/contact/email-template.tsx
import {
  Html,
  Body,
  Container,
  Text,
  Heading,
  Hr,
} from '@react-email/components'

type ContactEmailProps = {
  name: string
  email: string
  message: string
  lang: 'ja' | 'en'
}

export function ContactEmail({
  name,
  email,
  message,
  lang,
}: ContactEmailProps) {
  const translations = {
    ja: {
      title: '新しいお問い合わせ',
      name: '名前',
      email: 'メールアドレス',
      message: 'メッセージ',
    },
    en: {
      title: 'New Contact Form Submission',
      name: 'Name',
      email: 'Email',
      message: 'Message',
    },
  }

  const t = translations[lang]

  return (
    <Html>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{t.title}</Heading>
          <Text style={text}>
            <strong>{t.name}: </strong> {name}
          </Text>
          <Text style={text}>
            <strong>{t.email}: </strong> {email}
          </Text>
          <Hr style={hr} />
          <Text style={text}>
            <strong>{t.message}: </strong>
          </Text>
          <Text style={text}>{message}</Text>
        </Container>
      </Body>
    </Html>
  )
}

// スタイル定義
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.5',
  margin: '0 0 20px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 10px',
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}
