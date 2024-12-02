export interface AuthToken {
  token: string
  expiresAt: string
}

export interface UserId {
  value: string
}

// Auth Response
export interface AuthPayload {
  userId: UserId
  jwtResult: AuthToken
}
