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

export interface JwtPayload {
  exp: number
  email: string
  role: string
  sub: string
  iat: number
}
