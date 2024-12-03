package com.headblog.backend.app.usecase.auth.response

import com.headblog.backend.domain.model.auth.AuthTokens
import com.headblog.backend.domain.model.user.Email

interface AuthenticationResponse {
    val email: Email
    val authTokens: AuthTokens
}
