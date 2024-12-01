package com.headblog.backend.app.usecase.auth.command.signup

import com.headblog.backend.domain.model.user.EmailAlreadyExistsException
import com.headblog.backend.domain.model.user.User
import com.headblog.backend.domain.model.user.UserRepository
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
    private val idGenerator: IdGenerator<EntityId>
) : SignUpUseCase {

    override fun execute(command: SignUpCommand): SignUpResult {
        userRepository.findByEmail(command.email)?.let {
            throw EmailAlreadyExistsException(command.email.value)
        }

        // ドメインの集約メソッドを呼び出してユーザーを作成
        val user = User.create(
            idGenerator,
            command.email,
            command.password,
            passwordEncoder
        )

        val savedUser = userRepository.save(user)
        return SignUpResult(userId = savedUser.id)
    }
}
