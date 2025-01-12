package com.headblog.backend.app.usecase.auth.command.refresh

import com.headblog.backend.domain.model.user.UserId
import com.headblog.backend.domain.model.user.UserRepository
import com.headblog.backend.infra.api.admin.auth.response.RefreshTokenResponse
import com.headblog.backend.infra.service.auth.TokenService
import java.util.*
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class RefreshTokenService(
    private val tokenService: TokenService,
    private val userRepository: UserRepository
) : RefreshTokenUseCase {
    private val logger = LoggerFactory.getLogger(RefreshTokenService::class.java)

    override fun execute(command: RefreshTokenCommand): RefreshTokenResponse {
        logger.info("starting refresh process with provided refresh token")

        val userId = tokenService.validateRefreshToken(command.jwtToken)?.also {
            logger.info("refresh token validated successfully for user id: $it")
        } ?: run {
            logger.warn("invalid refresh token")
            throw IllegalArgumentException("invalid refresh token")
        }

        val user = userRepository.findById(UserId(UUID.fromString(userId)))?.also {
            logger.info("user found for id: $userId")
        } ?: run {
            logger.warn("user not found for id: $userId")
            throw NoSuchElementException("user not found")
        }

        return RefreshTokenResponse(
            email = user.email,
            authTokens = tokenService.createAuthTokens(user)
        ).also {
            logger.info("refresh process completed successfully for user id: $userId")
        }
    }
}
