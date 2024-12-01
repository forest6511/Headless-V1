package com.headblog.backend.domain.model.user

@JvmInline
value class PasswordHash private constructor(val value: String) {
    companion object {
        fun of(hash: String): PasswordHash {
            require(hash.isNotBlank()) { "Password hash cannot be blank" }
            return PasswordHash(hash)
        }
    }
}