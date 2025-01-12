package com.headblog.backend.app.usecase.auth.command.signup

// Commandクラスでは、可能な限りValueObjectを使用して、ドメインモデルの整合性を保ちます
data class SignUpCommand(
    val email: String,
    val password: String,
    val nickname: String,
    val language: String,
)
