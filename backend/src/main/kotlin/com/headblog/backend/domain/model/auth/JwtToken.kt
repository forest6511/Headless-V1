package com.headblog.backend.domain.model.auth

@JvmInline
value class JwtToken(val value: String) {
    companion object {
        fun of(value: String): JwtToken {
            require(value.isNotBlank()) { "Token cannot be blank" }
            return JwtToken(value)
        }
    }
}