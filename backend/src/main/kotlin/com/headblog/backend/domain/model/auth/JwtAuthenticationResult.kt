package com.headblog.backend.domain.model.auth

import java.util.*

data class JwtAuthenticationResult(
    val token: JwtToken,
    val expiresAt: Date
)