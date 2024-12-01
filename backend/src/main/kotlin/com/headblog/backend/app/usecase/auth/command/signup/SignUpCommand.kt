package com.headblog.backend.app.usecase.auth.command.signup

import com.headblog.backend.domain.model.user.Email

// Commandクラスでは、可能な限りValueObjectを使用して、ドメインモデルの整合性を保ちます
data class SignUpCommand(
    val email: Email,
    val password: String
)
