package com.headblog.backend.domain.model.user

import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import org.springframework.security.crypto.password.PasswordEncoder
import java.time.LocalDateTime

class User private constructor(
    val id: UserId,
    val email: Email,
    val passwordHash: PasswordHash,
    val role: UserRole,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {

    companion object {
        fun create(
            id: IdGenerator<EntityId>,
            email: Email,
            rawPassword: String,
            passwordEncoder: PasswordEncoder,
            role: UserRole = UserRole.USER,
            currentTime: LocalDateTime = LocalDateTime.now()
        ): User = User(
            id = UserId(id.generate().value),
            email = email,
            passwordHash = PasswordHash.of(passwordEncoder.encode(rawPassword)),
            role = role,
            createdAt = currentTime,
            updatedAt = currentTime
        )
    }

    fun copyWith(
        email: Email = this.email,
        passwordHash: PasswordHash = this.passwordHash,
        role: UserRole = this.role
    ): User = User(
        id = this.id,
        email = email,
        passwordHash = passwordHash,
        role = role,
        createdAt = this.createdAt,
        updatedAt = LocalDateTime.now()
    )

    fun validatePassword(rawPassword: String, passwordEncoder: PasswordEncoder): Boolean {
        return passwordEncoder.matches(rawPassword, passwordHash.value)
    }

    fun isAdmin(): Boolean = role == UserRole.ADMIN

    fun hasEmailChanged(newEmail: String): Boolean {
        return email.value != Email.of(newEmail).value
    }
}
