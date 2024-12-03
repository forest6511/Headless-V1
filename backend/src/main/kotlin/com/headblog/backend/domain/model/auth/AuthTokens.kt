package com.headblog.backend.domain.model.auth

import java.util.*

data class AuthTokens(
    val accessToken: JwtToken,
    val refreshToken: JwtToken,
    val expiresAt: Date,
    val refreshExpiresAt: Date
)