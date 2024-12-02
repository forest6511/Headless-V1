'use client'

import { Button, Input } from '@nextui-org/react'

export default function SignUpForm() {
  return (
    <form className="space-y-4">
      <Input
        label="メールアドレス"
        placeholder="example@example.com"
        type="email"
      />
      <Input
        label="パスワード"
        placeholder="パスワードを入力"
        type="password"
      />
      <Input
        label="パスワード（確認）"
        placeholder="パスワードを再入力"
        type="password"
      />
      <Button color="primary" className="w-full">
        サインアップ
      </Button>
    </form>
  )
}
