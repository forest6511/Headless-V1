package com.headblog.backend.app.usecase.auth.command.signup

import com.headblog.backend.app.usecase.auth.response.AuthenticationResponse
import com.headblog.backend.domain.model.auth.AuthTokens
import com.headblog.backend.domain.model.user.Email

data class SignUpResponse(
    override val email: Email,
    override val authTokens: AuthTokens
) : AuthenticationResponse