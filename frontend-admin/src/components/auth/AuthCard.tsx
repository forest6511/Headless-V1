'use client'

import { Card, CardBody, CardHeader, Tabs, Tab } from '@nextui-org/react'
import React from 'react'
import { useLanguageStore } from '@/stores/admin/languageStore'
import { t } from '@/lib/translations'

interface AuthCardProps {
  selected: string
  onSelectionChange: (key: string) => void
  children: React.ReactNode
}

export default ({ selected, onSelectionChange, children }: AuthCardProps) => {
  const currentLanguage = useLanguageStore((state) => state.language)

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex justify-center">
        <Tabs
          selectedKey={selected}
          onSelectionChange={(key) => onSelectionChange(key as string)}
        >
          <Tab key="signin" title={t(currentLanguage, 'auth.tabs.signin')} />
          <Tab key="signup" title={t(currentLanguage, 'auth.tabs.signup')} />
        </Tabs>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  )
}
