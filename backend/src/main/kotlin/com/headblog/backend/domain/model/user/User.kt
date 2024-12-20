package com.headblog.backend.domain.model.user

import com.headblog.backend.shared.id.domain.EntityId
import com.headblog.backend.shared.id.domain.IdGenerator
import java.time.LocalDateTime
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.password.PasswordEncoder

class User private constructor(
    val id: UserId,
    val email: Email,
    val passwordHash: PasswordHash,
    val role: UserRole,
    val enable: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) : UserDetails {

    companion object {
        fun create(
            id: IdGenerator<EntityId>,
            email: String,
            rawPassword: String,
            passwordEncoder: PasswordEncoder,
            role: UserRole = UserRole.USER,
            enable: Boolean = false,
            currentTime: LocalDateTime = LocalDateTime.now()
        ): User = User(
            id = UserId(id.generate().value),
            email = Email.of(email),
            passwordHash = PasswordHash.of(passwordEncoder.encode(rawPassword)),
            role = role,
            enable = enable,
            createdAt = currentTime,
            updatedAt = currentTime
        )
    }

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
        return enable
    }
}
