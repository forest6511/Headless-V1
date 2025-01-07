package com.headblog.backend.infra.service.auth

import com.headblog.backend.domain.model.auth.JwtToken
import com.headblog.backend.domain.model.user.User
import com.headblog.backend.domain.model.user.UserRepository
import com.headblog.backend.shared.exception.AuthException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class UserAuthenticationService(
    private val tokenService: TokenService,
    private val userRepository: UserRepository
) {
    private val logger = LoggerFactory.getLogger(UserAuthenticationService::class.java)

    fun getUserFromToken(token: JwtToken): User {
        logger.debug("validating token: ${token.value}")

        // トークンを検証し、メールアドレスを取得
        val email = tokenService.validateAccessToken(token)
        logger.debug("token validated successfully, extracted email: $email")

        // ユーザーをリポジトリから取得
        val user = userRepository.findByEmail(email)
            ?: run {
                logger.error("user not found for email: $email")
                throw AuthException("user not found with email: $email")
            }

        logger.debug("user found for email: $email")
        return user
    }
}
