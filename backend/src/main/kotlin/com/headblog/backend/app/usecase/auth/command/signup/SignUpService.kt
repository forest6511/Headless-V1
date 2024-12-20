package com.headblog.backend.app.usecase.auth.command.signup

import com.headblog.backend.domain.model.user.User
import com.headblog.backend.domain.model.user.UserRepository
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
    private val tokenService: TokenService
) : SignUpUseCase {

    private val logger = LoggerFactory.getLogger(SignUpService::class.java)

    override fun execute(command: SignUpCommand): SignUpResponse {
        logger.info("attempting to sign up user with email: ${command.email}")

        // create the user
        val user = User.create(
            idGenerator,
            command.email,
            command.password,
            passwordEncoder
        )

        // check if the email already exists
        userRepository.findByEmail(user.email)?.let {
            logger.error("email already exists: ${user.email.value}")
            throw AuthenticationCredentialsNotFoundException("email already exists: ${user.email.value}")
        }

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
