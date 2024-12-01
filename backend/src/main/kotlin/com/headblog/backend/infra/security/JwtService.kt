package com.headblog.backend.infra.security

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.headblog.backend.domain.model.auth.JwtToken
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
        val token = JWT.create()
            .withSubject(user.id.value.toString())
            .withClaim("email", user.email.value)
            .withClaim("role", user.role.name)
            .withIssuedAt(Date())
            .withExpiresAt(Date(System.currentTimeMillis() + expiration))
            .sign(Algorithm.HMAC256(secret))

        return JwtToken.of(token)
    }

    fun validateToken(token: JwtToken): String? {
        return try {
            JWT.require(Algorithm.HMAC256(secret))
                .build()
                .verify(token.value)
                .subject
        } catch (e: Exception) {
            // ログを追加して失敗の理由を記録
            logger.error("Token validation failed: ${e.message}", e)
            null
        }
    }
}
