package com.headblog.backend.app.usecase.auth.command.signup

import com.headblog.backend.domain.model.media.StorageService
import com.headblog.backend.domain.model.user.Email
import com.headblog.backend.domain.model.user.Language
import com.headblog.backend.domain.model.user.ThumbnailGenerator
import com.headblog.backend.domain.model.user.User
import com.headblog.backend.domain.model.user.UserId
import com.headblog.backend.domain.model.user.UserRepository
import com.headblog.backend.domain.model.user.UserRole
import com.headblog.backend.infra.service.auth.TokenService
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class SignUpService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val idGenerator: IdGenerator<EntityId>,
    private val tokenService: TokenService,
    private val thumbnailGenerator: ThumbnailGenerator,
    private val storageService: StorageService
) : SignUpUseCase {

    private val logger = LoggerFactory.getLogger(SignUpService::class.java)

    private val imgExtension = "png"
    private val uploadFormat = "image/png"

    override fun execute(command: SignUpCommand): SignUpResponse {
        logger.info("attempting to sign up user with email: ${command.email}")

        // check if the email already exists
        userRepository.findByEmail(Email.of(command.email))?.let {
            logger.error("email already exists: ${command.email}}")
            throw AuthenticationCredentialsNotFoundException("email already exists: ${command.email}}")
        }

        // check if the Nickname already exists
        userRepository.findByNickname(command.nickname)?.let {
            logger.error("nickname already exists: ${command.email}}")
            throw AuthenticationCredentialsNotFoundException("nickname already exists: ${command.nickname}}")
        }

        val userId = UserId(idGenerator.generate().value)

        val bateArray =
            thumbnailGenerator.generateThumbnailUrl(command.nickname, Language(command.language), imgExtension)
        val key = "profile/${userId.value}.$imgExtension"
        storageService.uploadFile(key, bateArray, uploadFormat)

        // create the user
        val user = User.create(
            id = userId,
            email = command.email,
            rawPassword = command.password,
            passwordEncoder = passwordEncoder,
            role = UserRole.USER,
            enable = false,
            nickname = command.nickname,
            thumbnailUrl = key,
            language = command.language,
        )

        // save the user to the repository
        val savedUser = userRepository.save(user)

        // generate JWT token
        logger.info("generating jwt token for user with email: ${user.email.value}")
        val authTokens = tokenService.createAuthTokens(savedUser)

        // return result with user id and JWT token
        logger.info("sign-up successful for email: ${savedUser.email}")
        return SignUpResponse(
            email = savedUser.email,
            authTokens = authTokens
        )
    }
}
