package com.headblog.backend.app.usecase.auth.command.signin

import org.slf4j.LoggerFactory
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException
import com.headblog.backend.domain.model.user.UserRepository
import com.headblog.backend.app.service.JwtService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class SignInService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
) : SignInUseCase {

    private val logger = LoggerFactory.getLogger(SignInService::class.java)

    override fun execute(command: SignInCommand): SignInResult {
        logger.info("signing in user with email: ${command.email.value}")

        // ユーザーを取得
        val user = userRepository.findByEmail(command.email)
            ?: run {
                logger.error("invalid credentials, user not found for email: ${command.email.value}")
                throw AuthenticationCredentialsNotFoundException("invalid credentials for email: ${command.email.value}")
            }

        // パスワードを検証
        if (!passwordEncoder.matches(command.password, user.passwordHash.value)) {
            logger.error("invalid credentials, incorrect password for email: ${command.email.value}")
            throw AuthenticationCredentialsNotFoundException("invalid credentials for email: ${command.email.value}")
        }

        // JWTトークン生成
        logger.info("generating JWT token for user with email: ${command.email.value}")
        val jwtAuthenticationResult = jwtService.generateJwtAuthenticationResult(user)

        // 結果返却（リフレッシュトークンを保存せず、JWTトークンだけを返す）
        logger.info("sign-in successful for email: ${command.email.value}")
        return SignInResult(
            email = user.email,
            role = user.role,
            jwtResult = jwtAuthenticationResult
        )
    }
}
