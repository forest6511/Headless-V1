package com.headblog.backend.app.usecase.auth.command.signin

import com.headblog.backend.domain.model.user.Email
import com.headblog.backend.domain.model.user.UserRepository
import com.headblog.backend.infra.api.admin.auth.response.SignInResponse
import com.headblog.backend.infra.config.StorageProperties
import com.headblog.backend.infra.service.auth.TokenService
import com.headblog.backend.shared.exception.AuthException
import org.slf4j.LoggerFactory
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class SignInService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val tokenService: TokenService,
    private val storageProperties: StorageProperties,
) : SignInUseCase {

    private val logger = LoggerFactory.getLogger(SignInService::class.java)

    override fun execute(command: SignInCommand): SignInResponse {
        logger.info("signing in user with email: ${command.email}")

        val email = Email.of(command.email)

        // ユーザーを取得
        val user = userRepository.findByEmail(email)
            ?: run {
                logger.error("invalid credentials, user not found for email: ${email.value}")
                throw AuthException("invalid credentials for email: ${email.value}")
            }

        // パスワードを検証
        if (!passwordEncoder.matches(command.password, user.passwordHash.value)) {
            logger.error("invalid credentials, incorrect password for email: ${email.value}")
            throw AuthException("invalid credentials for email: ${email.value}")
        }

        // JWTトークン生成
        logger.info("generating JWT token for user with email: ${email.value}")
        val authTokens = tokenService.createAuthTokens(user)

        logger.info("sign-in successful for email: ${user.email}")
        val thumbnailUrl = "${storageProperties.cloudflare.r2.publicEndpoint}/${checkNotNull(user.thumbnailUrl)}"

        return SignInResponse(
            email = user.email,
            authTokens = authTokens,
            nickname = user.nickname,
            thumbnailUrl = thumbnailUrl
        )
    }
}
