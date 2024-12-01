package com.headblog.backend.app.service

import com.headblog.backend.domain.model.auth.JwtAuthenticationResult
import com.headblog.backend.domain.model.user.*
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.*

@Service
class RefreshTokenService(
    private val jwtService: JwtService,
    private val userRepository: UserRepository
) {

    private val logger = LoggerFactory.getLogger(RefreshTokenService::class.java)

    // TODO Refactor candidate.
    fun refresh(refreshToken: String): JwtAuthenticationResult {
        logger.info("refreshing token for provided refreshToken: $refreshToken")

        // refreshTokenを検証
        val userId = jwtService.validateRefreshToken(refreshToken)
            ?: run {
                logger.warn("refresh token is invalid or expired: $refreshToken")
                throw IllegalArgumentException("refresh token is invalid or expired")
            }

        // ユーザーを取得
        val user = userRepository.findById(UserId(UUID.fromString(userId)))
            ?: run {
                logger.error("user not found for userId: $userId")
                throw NoSuchElementException("user not found with id: $userId")
            }

        // 新しいJWTトークンを生成
        logger.info("generating new JWT token for userId: $userId")
        val jwtAuthenticationResult = jwtService.generateJwtAuthenticationResult(user)

        // 結果を返却
        logger.info("new JWT token generated successfully for userId: $userId")
        return jwtAuthenticationResult
    }
}
