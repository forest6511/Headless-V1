// api/auth/signup
export interface SignupPayload {
  email: string
  password: string
  nickname: string
  language: string
}

// api/auth/signin
export interface SignInPayload {
  email: string
  password: string
}
