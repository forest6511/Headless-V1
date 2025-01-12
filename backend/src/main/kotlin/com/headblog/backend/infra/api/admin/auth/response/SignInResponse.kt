package com.headblog.backend.infra.api.admin.auth.response

import com.headblog.backend.app.usecase.auth.response.AuthenticationResponse
import com.headblog.backend.domain.model.auth.AuthTokens
import com.headblog.backend.domain.model.user.Email

data class SignInResponse(
    override val email: Email,
    override val authTokens: AuthTokens,
    val nickname: String,
    val thumbnailUrl: String,
) : AuthenticationResponse