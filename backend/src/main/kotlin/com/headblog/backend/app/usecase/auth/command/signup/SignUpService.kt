package com.headblog.backend.app.usecase.auth.command.signup

import org.slf4j.LoggerFactory
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException
import com.headblog.backend.domain.model.user.User
import com.headblog.backend.domain.model.user.UserRepository
import com.headblog.backend.app.service.JwtService
import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class SignUpService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val idGenerator: IdGenerator<EntityId>,
    private val jwtService: JwtService
) : SignUpUseCase {

    private val logger = LoggerFactory.getLogger(SignUpService::class.java)

    override fun execute(command: SignUpCommand): SignUpResult {
        logger.info("attempting to sign up user with email: ${command.email.value}")

        // check if the email already exists
        userRepository.findByEmail(command.email)?.let {
            logger.error("email already exists: ${command.email.value}")
            throw AuthenticationCredentialsNotFoundException("email already exists: ${command.email.value}")
        }

        // create the user
        val user = User.create(
            idGenerator,
            command.email,
            command.password,
            passwordEncoder
        )

        // save the user to the repository
        val savedUser = userRepository.save(user)

        // generate JWT token
        logger.info("generating jwt token for user with email: ${command.email.value}")
        val jwtAuthenticationResult = jwtService.generateJwtAuthenticationResult(savedUser)

        // return result with user id and JWT token
        logger.info("sign-up successful for email: ${command.email.value}")
        return SignUpResult(
            userId = savedUser.id,
            jwtResult = jwtAuthenticationResult
        )
    }
}
