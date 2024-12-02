'use client'

import { Card, CardBody, CardHeader, Tabs, Tab } from '@nextui-org/react'
import React from 'react'

interface AuthCardProps {
  selected: string
  onSelectionChange: (key: string) => void
  children: React.ReactNode
}

export default ({ selected, onSelectionChange, children }: AuthCardProps) => (
  <Card className="w-full max-w-md">
    <CardHeader className="flex justify-center">
      <Tabs
        selectedKey={selected}
        onSelectionChange={(key) => onSelectionChange(key as string)}
      >
        <Tab key="signin" title="ログイン" />
        <Tab key="signup" title="サインアップ" />
      </Tabs>
    </CardHeader>
    <CardBody>{children}</CardBody>
  </Card>
)
