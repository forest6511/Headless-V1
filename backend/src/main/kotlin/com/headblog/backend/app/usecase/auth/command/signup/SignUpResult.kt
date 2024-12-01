package com.headblog.backend.app.usecase.auth.command.signup

import com.headblog.backend.domain.model.user.UserId

data class SignUpResult(
    val userId: UserId
)