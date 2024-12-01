package com.headblog.backend.app.usecase.auth.command.signin

import com.headblog.backend.domain.model.user.InvalidCredentialsException
import com.headblog.backend.domain.model.user.UserRepository
import com.headblog.backend.infra.security.JwtService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class SignInService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) : SignInUseCase {

    override fun execute(command: SignInCommand): SignInResult {
        val user = userRepository.findByEmail(command.email)
            ?: throw InvalidCredentialsException()

        user.takeIf { it.validatePassword(command.password, passwordEncoder) }
            ?: throw InvalidCredentialsException()

        return SignInResult(
            token = jwtService.generateToken(user).toString(),
            email = user.email.value,
            role = user.role
        )
    }
}