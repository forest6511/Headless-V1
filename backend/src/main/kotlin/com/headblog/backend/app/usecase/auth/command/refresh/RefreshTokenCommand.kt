package com.headblog.backend.app.usecase.auth.command.refresh

import com.headblog.backend.domain.model.auth.JwtToken

data class RefreshTokenCommand(
    val jwtToken: JwtToken
)