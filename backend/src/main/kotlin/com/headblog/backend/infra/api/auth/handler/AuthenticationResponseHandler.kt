package com.headblog.backend.infra.api.auth.handler

import com.headblog.backend.app.usecase.auth.response.AuthenticationResponse
import com.headblog.backend.infra.service.cookie.CookieService
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component

@Component
class AuthenticationResponseHandler(
    private val cookieService: CookieService
) {
    fun <T : AuthenticationResponse> handle(result: T): ResponseEntity<T> {
        val authCookie = cookieService.createAuthTokenCookie(
            result.authTokens.accessToken,
            result.authTokens.expiresAt
        )
        val refreshCookie = cookieService.createRefreshTokenCookie(
            result.authTokens.refreshToken,
            result.authTokens.refreshExpiresAt
        )

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, authCookie.toString())
            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
            .body(result)
    }
}