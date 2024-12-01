package com.headblog.backend.app.usecase.auth.command.signin

import com.headblog.backend.domain.model.user.UserRole

data class SignInResult(
    val token: String,
    val email: String,
    val role: UserRole
)