package com.headblog.backend.infra.service.auth

import com.headblog.backend.domain.model.auth.JwtToken
import com.headblog.backend.domain.model.user.User
import com.headblog.backend.domain.model.user.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class UserAuthenticationService(
    private val tokenService: TokenService,
    private val userRepository: UserRepository
) {
    private val logger = LoggerFactory.getLogger(UserAuthenticationService::class.java)

    fun getUserFromToken(token: JwtToken): User {
        logger.info("validating token: ${token.value}")

        // トークンを検証し、メールアドレスを取得
        val email = tokenService.validateAccessToken(token)
        logger.info("token validated successfully, extracted email: $email")

        // ユーザーをリポジトリから取得
        val user = userRepository.findByEmail(email)
            ?: run {
                logger.error("user not found for email: $email")
                throw NoSuchElementException("user not found with email: $email")
            }

        logger.info("user found for email: $email")
        return user
    }
}
