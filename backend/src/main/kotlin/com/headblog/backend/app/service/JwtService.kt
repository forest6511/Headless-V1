package com.headblog.backend.app.service

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.headblog.backend.domain.model.auth.JwtAuthenticationResult
import com.headblog.backend.domain.model.auth.JwtToken
import com.headblog.backend.domain.model.user.Email
import com.headblog.backend.domain.model.user.User
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.*

@Service
class JwtService(
    @Value("\${jwt.secret}") private val secret: String,
    @Value("\${jwt.expiration}") private val expiration: Long
) {
    private val logger = LoggerFactory.getLogger(JwtService::class.java)

    fun generateToken(user: User): JwtToken {
        logger.info("generating token for user with id: ${user.id.value} and email: ${user.email.value}")

        val token = JWT.create()
            .withSubject(user.id.value.toString())
            .withClaim("email", user.email.value)
            .withClaim("role", user.role.name)
            .withIssuedAt(Date())
            .withExpiresAt(Date(System.currentTimeMillis() + expiration))
            .sign(Algorithm.HMAC256(secret))

        logger.info("token generated successfully")
        return JwtToken.of(token)
    }

    fun generateJwtAuthenticationResult(user: User): JwtAuthenticationResult {
        logger.info("generating JWT authentication result for user: ${user.id.value}")

        val token = generateToken(user)
        val expirationDate = Date(System.currentTimeMillis() + expiration)
        logger.info("JWT authentication result generated successfully for user: ${user.id.value}")

        return JwtAuthenticationResult(token, expirationDate)
    }

    fun validateToken(token: JwtToken): Email {
        try {
            logger.info("validating token: $token")

            val decodedJWT = JWT.require(Algorithm.HMAC256(secret))
                .build()
                .verify(token.value)

            val email = decodedJWT.getClaim("email").asString()
            logger.info("token validated successfully, subject: ${decodedJWT.subject}, email: $email")

            return Email.of(email)
        } catch (e: Exception) {
            logger.error("error validating token: ${e.message}", e)
            throw IllegalArgumentException("invalid token")
        }
    }

    fun validateRefreshToken(refreshToken: String): String? {
        try {
            logger.info("validating refresh token")

            val decodedJWT = JWT.require(Algorithm.HMAC256(secret))
                .build()
                .verify(refreshToken)

            val userId = decodedJWT.subject
            val expiresAt = decodedJWT.expiresAt

            // トークンが期限切れでないかを確認
            if (expiresAt.before(Date())) {
                logger.warn("refresh token has expired")
                return null
            }

            logger.info("refresh token validated successfully, userId: $userId")
            return userId
        } catch (e: Exception) {
            logger.error("error validating refresh token: ${e.message}", e)
            throw IllegalArgumentException("invalid refresh token")
        }
    }
}
