'use client'

import { useState } from 'react'
import AuthCard from './AuthCard'
import SignUpForm from './SignUpForm'
import SignInForm from './SignInForm'

export default function AuthWrapper() {
  const [selected, setSelected] = useState('signin')

  return (
    <AuthCard selected={selected} onSelectionChange={setSelected}>
      {selected === 'signin' ? <SignInForm /> : <SignUpForm />}
    </AuthCard>
  )
}
