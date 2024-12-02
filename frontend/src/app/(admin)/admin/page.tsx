'use client'


import { useState } from 'react'
import { Card, CardBody, CardHeader, Input, Button, Tabs, Tab } from "@nextui-org/react"

export default function LoginPage() {
    const [selected, setSelected] = useState("login")

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader className="flex justify-center">
                    <Tabs
                        selectedKey={selected}
                        onSelectionChange={(key) => setSelected(key as string)}
                    >
                        <Tab key="login" title="ログイン" />
                        <Tab key="signup" title="サインアップ" />
                    </Tabs>
                </CardHeader>
                <CardBody>
                    {selected === "login" ? <LoginForm /> : <SignupForm />}
                </CardBody>
            </Card>
        </div>
    )
}

function LoginForm() {
    return (
        <form className="space-y-4">
            <Input label="メールアドレス" placeholder="example@example.com" type="email" />
            <Input label="パスワード" placeholder="パスワードを入力" type="password" />
            <Button color="primary" className="w-full">
                ログイン
            </Button>
        </form>
    )
}

function SignupForm() {
    return (
        <form className="space-y-4">
            <Input label="ユーザー名" placeholder="ユーザー名を入力" />
            <Input label="メールアドレス" placeholder="example@example.com" type="email" />
            <Input label="パスワード" placeholder="パスワードを入力" type="password" />
            <Input label="パスワード（確認）" placeholder="パスワードを再入力" type="password" />
            <Button color="primary" className="w-full">
                サインアップ
            </Button>
        </form>
    )
}

