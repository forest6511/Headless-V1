package com.headblog.backend.infra.api.auth.request

import jakarta.validation.constraints.NotBlank

data class RefreshTokenRequest(
    @field:NotBlank(message = "Token is required")
    val refreshToken: String
)