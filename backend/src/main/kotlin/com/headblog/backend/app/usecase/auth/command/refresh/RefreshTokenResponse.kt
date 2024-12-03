package com.headblog.backend.app.usecase.auth.command.refresh

import com.headblog.backend.app.usecase.auth.response.AuthenticationResponse
import com.headblog.backend.domain.model.auth.AuthTokens
import com.headblog.backend.domain.model.user.Email

data class RefreshTokenResponse(
    override val email: Email,
    override val authTokens: AuthTokens,
) : AuthenticationResponse