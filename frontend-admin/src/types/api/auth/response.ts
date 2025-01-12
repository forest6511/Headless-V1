export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: string
  refreshExpiresAt: string
}

export interface Email {
  email: string
}

// Auth Response
export interface AuthResponse {
  email: Email
  authTokens: AuthTokens
}

export interface SignInResponse {
  email: Email
  authTokens: AuthTokens
  nickname: string
  thumbnailUrl: string
  language: string
}
