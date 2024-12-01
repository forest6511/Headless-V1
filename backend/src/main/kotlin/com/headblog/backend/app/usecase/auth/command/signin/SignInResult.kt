package com.headblog.backend.app.usecase.auth.command.signin

import com.headblog.backend.domain.model.auth.JwtAuthenticationResult
import com.headblog.backend.domain.model.user.Email
import com.headblog.backend.domain.model.user.UserRole

data class SignInResult(
    val email: Email,
    val role: UserRole,
    val jwtResult: JwtAuthenticationResult,
)