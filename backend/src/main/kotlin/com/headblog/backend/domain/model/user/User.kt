package com.headblog.backend.domain.model.user

import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.password.PasswordEncoder
import java.time.LocalDateTime

class User private constructor(
    val id: UserId,
    val email: Email,
    val passwordHash: PasswordHash,
    val role: UserRole,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) : UserDetails {

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

    override fun getAuthorities(): Collection<GrantedAuthority> {
        return listOf(SimpleGrantedAuthority(role.name)) // UserRoleに基づく権限を返す
    }

    override fun getPassword(): String {
        // ハッシュ化されたパスワード
        return passwordHash.value
    }

    override fun getUsername(): String {
        // ユーザー名としてemailを使用
        return email.value
    }

    override fun isAccountNonExpired(): Boolean {
        return true
    }

    override fun isAccountNonLocked(): Boolean {
        return true
    }

    override fun isCredentialsNonExpired(): Boolean {
        return true
    }

    override fun isEnabled(): Boolean {
        return true
    }
}
