package com.headblog.backend.app.usecase.auth.command.signin

// Commandクラスでは、可能な限りValueObjectを使用して、ドメインモデルの整合性を保ちます
data class SignInCommand(
    val email: String,
    val password: String
)