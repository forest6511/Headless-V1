package com.headblog.backend.infra.service.auth

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.interfaces.DecodedJWT
import com.headblog.backend.domain.model.auth.AuthTokens
import com.headblog.backend.domain.model.auth.JwtToken
import com.headblog.backend.domain.model.user.Email
import com.headblog.backend.domain.model.user.User
import java.util.*
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class TokenService(
    @Value("\${jwt.secret}") private val secret: String,
    @Value("\${jwt.expiration}") private val expiration: Long,
    @Value("\${jwt.refresh-expiration}") private val refreshExpiration: Long
) {
    private val logger = LoggerFactory.getLogger(TokenService::class.java)

    fun createAuthTokens(user: User): AuthTokens {
        logger.debug("generating jwt authentication result for user: ${user.id.value}")

        val accessToken = createToken(user, expiration)
        val refreshToken = createToken(user, refreshExpiration)

        return AuthTokens(
            accessToken = accessToken,
            refreshToken = refreshToken,
            expiresAt = expiration.toDate(),
            refreshExpiresAt = refreshExpiration.toDate()
        )
            .also {
                logger.debug("jwt authentication result generated for user: ${user.id.value}")
            }
    }

    private fun createToken(user: User, duration: Long): JwtToken =
        JWT.create()
            .withSubject(user.id.value.toString())
            .apply {
                withClaim("email", user.email.value)
                withClaim("role", user.role.name)
            }
            .withIssuedAt(Date())
            .withExpiresAt(duration.toDate())
            .sign(Algorithm.HMAC256(secret))
            .let { JwtToken.of(it) }
            .also { logger.debug("token generated successfully for user: {}", user.id.value) }

    fun validateAccessToken(token: JwtToken): Email =
        validateToken(token) { decodedJWT ->
            decodedJWT.getClaim("email").asString().let {
                logger.debug("access token validated successfully, email: $it")
                Email.of(it)
            }
        }

    fun validateRefreshToken(token: JwtToken): String? =
        validateToken(token) { decodedJWT ->
            decodedJWT.subject
                .also {
                    logger.debug("refresh token validated successfully, subject: $it")
                }
        }

    private fun <T> validateToken(token: JwtToken, claimExtractor: (DecodedJWT) -> T): T = try {
        JWT.require(Algorithm.HMAC256(secret))
            .build()
            .verify(token.value)
            .also {
                if (it.expiresAt.before(Date())) {
                    logger.warn("token has expired")
                    throw IllegalArgumentException("token has expired")
                }
            }.let(claimExtractor)
    } catch (e: Exception) {
        logger.error("error validating token: ${token.value} ${e.message}")
        throw IllegalArgumentException("invalid token")
    }

    private fun Long.toDate(): Date = Date(System.currentTimeMillis() + this)
}
